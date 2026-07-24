import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { EntitlementActivationService } from "./entitlement-activation.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly entitlementActivation: EntitlementActivationService,
  ) {}

  async createOrder(data: {
    familyId: string;
    organizationId: string;
    items: Array<{
      productVersionId: string;
      snapshotName: string;
      snapshotDescription?: string;
      snapshotAmount: number;
      snapshotCurrency: string;
      snapshotEntitlements: unknown;
      quantity: number;
    }>;
    actorUserId: string;
  }) {
    const totalAmount = data.items.reduce((s, i) => s + i.snapshotAmount * i.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        familyId: data.familyId,
        status: "PENDING",
        totalAmount,
        currency: data.items[0]?.snapshotCurrency ?? "RON",
        items: {
          createMany: {
            data: data.items.map(i => ({
              productVersionId: i.productVersionId,
              quantity: i.quantity,
              unitAmount: i.snapshotAmount,
              totalAmount: i.snapshotAmount * i.quantity,
              snapshotName: i.snapshotName,
              snapshotDescription: i.snapshotDescription,
              snapshotAmount: i.snapshotAmount,
              snapshotCurrency: i.snapshotCurrency,
              snapshotEntitlements: i.snapshotEntitlements as any,
            })),
          },
        },
      },
      include: { items: true },
    });

    await this.audit.logEvent({
      actorUserId: data.actorUserId,
      organizationId: data.organizationId,
      action: "order.created",
      entityType: "Order",
      entityId: order.id,
    });

    return order;
  }

  async listOrders(organizationId: string, filters?: { familyId?: string; status?: string }) {
    return this.prisma.order.findMany({
      where: {
        family: { organizationId },
        familyId: filters?.familyId,
        status: filters?.status as any,
      },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
        family: { include: { parents: { include: { user: { select: { firstName: true, lastName: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async handlePaymentWebhook(data: {
    eventId: string;
    provider: string;
    eventType: string;
    payload: unknown;
    signature: string;
  }) {
    const existing = await this.prisma.paymentWebhookEvent.findUnique({
      where: { eventId: data.eventId },
    });

    if (existing?.processed) {
      return { status: "already_processed" };
    }

    const webhookEvent = await this.prisma.paymentWebhookEvent.upsert({
      where: { eventId: data.eventId },
      create: {
        eventId: data.eventId,
        provider: data.provider,
        type: data.eventType,
        payload: data.payload as any,
        processed: false,
      },
      update: {},
    });

    if (data.eventType === "payment.succeeded" || data.eventType === "checkout.session.completed") {
      const payload = data.payload as any;
      const orderId = payload.orderId ?? payload.metadata?.orderId;

      if (orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (order && order.status !== "PAID") {
          await this.prisma.payment.create({
            data: {
              orderId,
              status: "SUCCEEDED",
              amount: order.totalAmount,
              currency: order.currency,
              provider: data.provider,
              providerTxId: data.eventId,
            },
          });

          await this.prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });

          await this.entitlementActivation.activateEntitlementsForOrder(orderId);
        }
      }
    }

    await this.prisma.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processed: true, processedAt: new Date() },
    });

    return { status: "processed" };
  }

  async recordManualPayment(data: {
    orderId: string;
    amount: number;
    reference: string;
    reason: string;
    actorUserId: string;
  }) {
    const order = await this.prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "PAID") throw new BadRequestException("Order already paid");

    await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        status: "SUCCEEDED",
        amount: data.amount,
        currency: order.currency,
        provider: "MANUAL",
        providerTxId: data.reference,
      },
    });

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: "PAID" },
    });

    await this.entitlementActivation.activateEntitlementsForOrder(data.orderId, data.actorUserId);

    await this.audit.logEvent({
      actorUserId: data.actorUserId,
      action: "order.manual_payment",
      entityType: "Order",
      entityId: data.orderId,
      metadata: { reference: data.reference, reason: data.reason },
    });

    return { status: "paid" };
  }
}
