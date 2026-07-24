import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class EntitlementActivationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async activateEntitlementsForOrder(orderId: string, actorUserId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) throw new Error(`Order ${orderId} not found`);

    const defaultSessionType = await this.prisma.sessionType.findFirst();
    if (!defaultSessionType) return { activated: false, reason: "No SessionType defined" };

    const created = [];
    for (const item of order.items) {
      const entitlements = (item.snapshotEntitlements as any[]) ?? [];
      for (const ent of entitlements) {
        if (ent.type === "SESSION_CREDIT") {
          const qty = ent.quantity ?? 1;
          for (let i = 0; i < qty; i++) {
            const expiry = ent.validityDays
              ? new Date(Date.now() + ent.validityDays * 86400_000)
              : null;

            const credit = await this.prisma.sessionCredit.create({
              data: {
                familyId: order.familyId,
                childId: order.childId,
                sessionTypeId: defaultSessionType.id,
                duration: 50,
                status: "AVAILABLE",
                sourceOrderId: orderId,
                expiresAt: expiry,
              },
            });
            created.push(credit);
          }
        }
      }
    }

    await this.audit.logEvent({
      actorUserId,
      action: "order.entitlements.activated",
      entityType: "Order",
      entityId: orderId,
      metadata: { count: created.length },
    });

    return { activated: true, entitlements: created };
  }
}
