import { Module } from "@nestjs/common";
import { WorkflowsController } from "./workflows.controller";
import { JourneyEngineService } from "./journey-engine.service";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [WorkflowsController],
  providers: [JourneyEngineService],
  exports: [JourneyEngineService],
})
export class WorkflowsModule {}
