import { Controller, Get, Post, Param, Body, UseGuards, Req, Query, RawBodyRequest } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("orders")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("orders.read")
  listOrders(@Req() req: Request, @Query("familyId") familyId?: string, @Query("status") status?: string) {
    const user = (req as any).user;
    return this.ordersService.listOrders(user.organizationId, { familyId, status });
  }

  @Post("orders")
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.ordersService.createOrder({ ...body, actorUserId: user.sub });
  }

  /** Idempotent webhook — no auth required (signature verified inside service) */
  @Post("payments/webhook")
  handleWebhook(@Body() body: any, @Req() req: Request) {
    const signature = (req.headers["stripe-signature"] ?? req.headers["x-webhook-signature"] ?? "") as string;
    return this.ordersService.handlePaymentWebhook({
      eventId: body.id ?? body.event_id,
      provider: (req.headers["x-payment-provider"] as string) ?? "MOCK",
      eventType: body.type ?? body.event_type,
      payload: body,
      signature,
    });
  }

  @Post("orders/:id/manual-payment")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("payments.manage")
  manualPayment(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.ordersService.recordManualPayment({ ...body, orderId: id, actorUserId: user.sub });
  }
}
