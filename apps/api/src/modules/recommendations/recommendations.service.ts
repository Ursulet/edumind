import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async createRecommendation(caseId: string, data: { productVersionId: string; note?: string; actorUserId: string }) {
    const rec = await this.prisma.productRecommendation.create({
      data: {
        caseId,
        productVersionId: data.productVersionId,
        staffId: data.actorUserId,
        reason: data.note,
        status: "RECOMMENDED",
        expiresAt: new Date(Date.now() + 30 * 86400_000),
      },
    });
    await this.audit.logEvent({ actorUserId: data.actorUserId, action: "recommendation.created", entityType: "ProductRecommendation", entityId: rec.id });
    return rec;
  }

  async respondToRecommendation(id: string, action: "ACCEPTED" | "DECLINED", userId: string) {
    const rec = await this.prisma.productRecommendation.findUnique({
      where: { id },
      include: { case: { include: { child: { include: { family: { include: { parents: true } } } } } } },
    });
    if (!rec) throw new NotFoundException("Recommendation not found");

    const parent = rec.case.child.family.parents.find(p => p.userId === userId);
    if (!parent) throw new ForbiddenException("Access denied");

    const updateData: any = { status: action };
    if (action === "ACCEPTED") updateData.acceptedAt = new Date();
    if (action === "DECLINED") updateData.declinedAt = new Date();

    return this.prisma.productRecommendation.update({
      where: { id },
      data: updateData,
    });
  }
}
