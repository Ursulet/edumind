import { Module } from "@nestjs/common";
import { SchedulingController } from "./scheduling.controller";
import { SchedulingService } from "./scheduling.service";
import { SlotGeneratorService } from "./slot-generator.service";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, SlotGeneratorService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
