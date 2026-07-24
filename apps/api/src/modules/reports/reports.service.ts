import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async createReport(caseId: string, data: { templateVersionId: string; title: string; actorUserId: string }) {
    const report = await this.prisma.report.create({
      data: { caseId, templateVersionId: data.templateVersionId, title: data.title ?? "Raport Orientare", status: "DRAFT", authorId: data.actorUserId },
    });
    await this.audit.logEvent({ actorUserId: data.actorUserId, action: "report.created", entityType: "Report", entityId: report.id });
    return report;
  }

  async publishReport(reportId: string, actorUserId: string) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException("Report not found");
    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    await this.audit.logEvent({ actorUserId, action: "report.published", entityType: "Report", entityId: reportId });
    return updated;
  }

  async getReportForParent(reportId: string, userId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { sections: true, case: { include: { child: { include: { family: true } } } } },
    });
    if (!report) throw new NotFoundException("Report not found");
    if (report.status !== "PUBLISHED") throw new ForbiddenException("Report not yet published");
    const parent = await this.prisma.parentProfile.findFirst({ where: { userId, familyId: report.case.child.familyId } });
    if (!parent) throw new ForbiddenException("Access denied");
    return report;
  }
}
