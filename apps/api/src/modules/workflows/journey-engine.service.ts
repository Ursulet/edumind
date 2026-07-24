import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

export interface NextActionResult {
  currentStepId: string | null;
  currentStepLabel: string;
  parentFacingLabel: string;
  stepType: string;
  responsibleRole: string;
  isBlocked: boolean;
  blockingReason: string | null;
  progressPercent: number;
}

@Injectable()
export class JourneyEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getNextAction(caseId: string): Promise<NextActionResult> {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: { caseId },
      include: {
        stepInstances: {
          include: { step: true },
          orderBy: { step: { order: "asc" } },
        },
        version: { include: { steps: { orderBy: { order: "asc" } } } },
      },
    });

    if (!instance) {
      return {
        currentStepId: null,
        currentStepLabel: "Fara flux",
        parentFacingLabel: "În asteptare",
        stepType: "WAIT",
        responsibleRole: "SYSTEM",
        isBlocked: false,
        blockingReason: null,
        progressPercent: 0,
      };
    }

    const totalSteps = instance.version.steps.length;
    const completedSteps = instance.stepInstances.filter(s => s.status === "COMPLETED").length;
    const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const currentStepInst = instance.stepInstances.find(s => s.status === "ACTIVE" || s.status === "PENDING") ?? instance.stepInstances[0];
    const currentStep = currentStepInst?.step;

    return {
      currentStepId: currentStep?.id ?? null,
      currentStepLabel: currentStep?.internalLabel ?? "Finalizat",
      parentFacingLabel: currentStep?.parentLabel ?? currentStep?.internalLabel ?? "În progres",
      stepType: currentStep?.type ?? "COMPLETE",
      responsibleRole: currentStep?.responsibleRole ?? "SYSTEM",
      isBlocked: currentStepInst?.status === "BLOCKED",
      blockingReason: currentStepInst?.blockedReason ?? null,
      progressPercent,
    };
  }

  async completeStep(data: {
    caseId: string;
    stepId: string;
    actorUserId: string;
    requiredPermission?: string;
    completionData?: unknown;
  }) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: { caseId: data.caseId },
      include: {
        version: {
          include: {
            steps: { orderBy: { order: "asc" } },
            transitions: true,
          },
        },
        stepInstances: true,
      },
    });

    if (!instance) throw new NotFoundException("Journey instance not found");

    await this.prisma.journeyStepInstance.updateMany({
      where: { instanceId: instance.id, stepId: data.stepId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    const transitions = instance.version.transitions.filter(t => t.fromStepId === data.stepId);
    const nextTransition = transitions[0];

    let nextStepId: string | null = nextTransition?.toStepId ?? null;

    if (!nextStepId) {
      const currentStep = instance.version.steps.find(s => s.id === data.stepId);
      const nextStep = instance.version.steps.find(s => s.order === (currentStep?.order ?? 0) + 1);
      nextStepId = nextStep?.id ?? null;
    }

    const updatedInstance = await this.prisma.journeyInstance.update({
      where: { id: instance.id },
      data: {
        status: nextStepId ? "ACTIVE" : "COMPLETED",
      },
    });

    if (nextStepId) {
      await this.prisma.journeyStepInstance.updateMany({
        where: { instanceId: instance.id, stepId: nextStepId },
        data: { status: "ACTIVE" },
      });
    }

    await this.prisma.journeyEvent.create({
      data: {
        instanceId: instance.id,
        actionType: "STEP_COMPLETED", actorId: data.actorUserId,
        payload: data.completionData as any,
      },
    });

    await this.audit.logEvent({
      actorUserId: data.actorUserId,
      action: "journey.step.completed",
      entityType: "JourneyStepInstance",
      entityId: data.stepId,
      metadata: { caseId: data.caseId, nextStepId },
    });

    return updatedInstance;
  }

  async listTemplates(organizationId: string) {
    return this.prisma.journeyTemplate.findMany({
      where: { organizationId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createTemplate(organizationId: string, data: {
    name: string;
    description?: string;
    initialSteps?: Array<{ internalLabel: string; type: string; order: number; responsibleRole?: string }>;
  }, actorUserId: string) {
    const template = await this.prisma.journeyTemplate.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
      },
    });

    if (data.initialSteps?.length) {
      const version = await this.prisma.journeyVersion.create({
        data: {
          templateId: template.id,
          version: 1,
          status: "DRAFT",
        },
      });

      await this.prisma.journeyStep.createMany({
        data: data.initialSteps.map(s => ({
          versionId: version.id,
          internalLabel: s.internalLabel,
          parentLabel: s.internalLabel,
          type: s.type as any,
          order: s.order,
          responsibleRole: s.responsibleRole ?? "SPECIALIST",
        })),
      });
    }

    await this.audit.logEvent({
      actorUserId,
      organizationId,
      action: "journey.template.created",
      entityType: "JourneyTemplate",
      entityId: template.id,
    });

    return template;
  }

  async publishVersion(versionId: string, actorUserId: string) {
    const version = await this.prisma.journeyVersion.findUnique({ where: { id: versionId } });
    if (!version) throw new NotFoundException("Version not found");
    if (version.status === "PUBLISHED") throw new BadRequestException("Already published");

    const updated = await this.prisma.journeyVersion.update({
      where: { id: versionId },
      data: { status: "PUBLISHED" },
    });

    await this.audit.logEvent({
      actorUserId,
      action: "journey.version.published",
      entityType: "JourneyVersion",
      entityId: versionId,
    });

    return updated;
  }
}


