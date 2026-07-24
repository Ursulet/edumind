import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async assignAssessment(caseId: string, data: { templateId: string; deadline?: string; actorUserId: string }) {
    const template = await this.prisma.externalAssessmentTemplate.findUnique({ where: { id: data.templateId } });
    if (!template) throw new NotFoundException("Assessment template not found");

    const assessment = await this.prisma.caseAssessment.create({
      data: {
        caseId,
        templateId: data.templateId,
        status: "ASSIGNED",
        assignedById: data.actorUserId,
        assignedAt: new Date(),
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });

    await this.audit.logEvent({ actorUserId: data.actorUserId, action: "assessment.assigned", entityType: "CaseAssessment", entityId: assessment.id });
    return assessment;
  }

  async updateStatus(assessmentId: string, status: string, actorUserId: string) {
    const a = await this.prisma.caseAssessment.findUnique({ where: { id: assessmentId } });
    if (!a) throw new NotFoundException("Assessment not found");

    const updated = await this.prisma.caseAssessment.update({
      where: { id: assessmentId },
      data: { status: status as any, ...(status === "OPENED" ? { openedAt: new Date() } : {}) },
    });

    await this.audit.logEvent({ actorUserId, action: `assessment.${status.toLowerCase()}`, entityType: "CaseAssessment", entityId: assessmentId });
    return updated;
  }

  async saveResult(assessmentId: string, resultData: { profileSummary?: string; interests?: unknown }, actorUserId: string) {
    const existing = await this.prisma.assessmentResult.findUnique({ where: { assessmentId } });
    const result = existing
      ? await this.prisma.assessmentResult.update({ where: { id: existing.id }, data: { profileSummary: resultData.profileSummary, interests: resultData.interests as any } })
      : await this.prisma.assessmentResult.create({ data: { assessmentId, profileSummary: resultData.profileSummary, interests: resultData.interests as any } });

    await this.prisma.caseAssessment.update({ where: { id: assessmentId }, data: { status: "RESULT_RECEIVED" } });
    await this.audit.logEvent({ actorUserId, action: "assessment.result_saved", entityType: "AssessmentResult", entityId: result.id });
    return result;
  }
}
