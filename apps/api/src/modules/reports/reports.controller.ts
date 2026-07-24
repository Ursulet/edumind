import { Controller, Post, Patch, Get, Param, Body, UseGuards, Req } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("reports")
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions("reports.manage")
  create(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.createReport(body.caseId, { ...body, actorUserId: user.sub });
  }

  @Patch(":id/publish")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("reports.manage")
  publish(@Param("id") id: string, @Req() req: Request) {
    return this.svc.publishReport(id, (req as any).user.sub);
  }

  @Get(":id/parent")
  getForParent(@Param("id") id: string, @Req() req: Request) {
    return this.svc.getReportForParent(id, (req as any).user.sub);
  }
}
