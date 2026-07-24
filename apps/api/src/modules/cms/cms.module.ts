import { Module } from "@nestjs/common";
import { CmsController } from "./cms.controller";
import { CmsService } from "./cms.service";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
