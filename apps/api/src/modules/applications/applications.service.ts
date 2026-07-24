import {
  Injectable, NotFoundException, BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

export interface CreateApplicationDto {
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phone: string;
  childFirstName: string;
  childLastName: string;
  dateOfBirth?: string;
  grade?: string;
  city?: string;
  county?: string;
  declaredNeed?: string;
  consentParticipation: boolean;
  consentDataProcessing: boolean;
  consentTerms: boolean;
  organizationId: string;
}

export interface ReviewApplicationDto {
  status: "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED" | "UNDER_REVIEW";
  internalNote?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createApplication(dto: CreateApplicationDto) {
    let user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase().trim() } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          firstName: dto.parentFirstName,
          lastName: dto.parentLastName,
          phone: dto.phone,
          passwordHash: "",
          status: "PENDING_VERIFICATION",
        },
      });
    }

    let parent = await this.prisma.parentProfile.findUnique({ where: { userId: user.id } });
    if (!parent) {
      const family = await this.prisma.family.create({
        data: {
          organizationId: dto.organizationId,
        },
      });
      parent = await this.prisma.parentProfile.create({
        data: {
          userId: user.id,
          familyId: family.id,
          relationship: "PARINTE",
        },
      });
    }

    const application = await this.prisma.application.create({
      data: {
        familyId: parent.familyId,
        status: "SUBMITTED",
        declaredNeed: dto.declaredNeed,
        data: {
          childFirstName: dto.childFirstName,
          childLastName: dto.childLastName,
          dateOfBirth: dto.dateOfBirth,
          grade: dto.grade,
          city: dto.city,
          county: dto.county,
        },
      },
    });

    if (dto.consentDataProcessing) {
      await this.prisma.consentRecord.create({
        data: {
          parentId: parent.id,
          type: "DATA_PROCESSING",
          textVersion: "v1.0",
          source: "APPLICATION_FORM",
        },
      });
    }

    await this.audit.logEvent({
      actorUserId: user.id,
      organizationId: dto.organizationId,
      action: "application.submitted",
      entityType: "Application",
      entityId: application.id,
    });

    return application;
  }

  async listApplications(organizationId: string, filters?: { status?: string }) {
    return this.prisma.application.findMany({
      where: {
        family: { organizationId },
        status: filters?.status as any,
      },
      include: {
        family: { include: { parents: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } } },
        history: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getApplication(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            children: true,
            parents: { include: { user: true } },
          },
        },
        history: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!app) throw new NotFoundException("Application not found");
    return app;
  }

  async reviewApplication(
    applicationId: string,
    dto: ReviewApplicationDto,
    actorUserId: string,
    organizationId: string,
  ) {
    const app = await this.getApplication(applicationId);

    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: dto.status as any,
        changedById: actorUserId,
        notes: dto.internalNote,
      },
    });

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: dto.status as any },
    });

    await this.audit.logEvent({
      actorUserId,
      organizationId,
      action: `application.${dto.status.toLowerCase()}`,
      entityType: "Application",
      entityId: applicationId,
      metadata: { status: dto.status },
    });

    return updated;
  }

  async convertToCase(
    applicationId: string,
    dto: { specialistId: string; journeyTemplateId: string; departmentId: string },
    actorUserId: string,
    organizationId: string,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { family: { include: { children: true } } },
    });
    if (!app) throw new NotFoundException("Application not found");
    if (app.status !== "APPROVED") throw new BadRequestException("Application must be APPROVED first");

    const formData = (app.data as any) ?? {};

    let child = app.family.children[0];
    if (!child) {
      child = await this.prisma.childProfile.create({
        data: {
          familyId: app.familyId,
          firstName: formData.childFirstName ?? "Copil",
          lastName: formData.childLastName ?? "",
          grade: formData.grade,
          city: formData.city,
          county: formData.county,
        },
      });
    }

    const year = new Date().getFullYear();
    const count = await this.prisma.careerCase.count({
      where: { child: { family: { organizationId } } },
    });
    const publicId = `EC-${year}-${String(count + 1).padStart(6, "0")}`;

    const journeyVersion = await this.prisma.journeyVersion.findFirst({
      where: { templateId: dto.journeyTemplateId, status: "PUBLISHED" },
      orderBy: { version: "desc" },
    });
    if (!journeyVersion) throw new BadRequestException("No published journey version found");

    const careerCase = await this.prisma.careerCase.create({
      data: {
        publicId,
        childId: child.id,
        departmentId: dto.departmentId,
        status: "ONBOARDING",
        assignments: {
          create: {
            staffId: dto.specialistId,
            role: "PRIMARY_SPECIALIST",
          },
        },
      },
    });

    const steps = await this.prisma.journeyStep.findMany({
      where: { versionId: journeyVersion.id },
      orderBy: { order: "asc" },
    });

    await this.prisma.journeyInstance.create({
      data: {
        caseId: careerCase.id,
        versionId: journeyVersion.id,
        status: "ACTIVE",
        stepInstances: {
          createMany: {
            data: steps.map((s) => ({
              stepId: s.id,
              status: s.id === steps[0]?.id ? "ACTIVE" : "PENDING",
            })),
          },
        },
      },
    });

    await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: "CONVERTED_TO_CASE" },
    });

    await this.audit.logEvent({
      actorUserId,
      organizationId,
      action: "application.converted_to_case",
      entityType: "CareerCase",
      entityId: careerCase.id,
    });

    return careerCase;
  }
}
