import { Module } from "@nestjs/common";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsService } from "./recommendations.service";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
