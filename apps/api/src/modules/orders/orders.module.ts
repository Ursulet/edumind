import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { EntitlementActivationService } from "./entitlement-activation.service";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [OrdersController],
  providers: [OrdersService, EntitlementActivationService],
  exports: [OrdersService, EntitlementActivationService],
})
export class OrdersModule {}
