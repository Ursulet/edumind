import { Controller, Post, Patch, Put, Param, Body, UseGuards, Req } from "@nestjs/common";
import { AssessmentsService } from "./assessments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("cases/:caseId/assessments")
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly svc: AssessmentsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions("assessments.manage")
  assign(@Param("caseId") caseId: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.assignAssessment(caseId, { ...body, actorUserId: user.sub });
  }

  @Patch(":id/status")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("assessments.manage")
  updateStatus(@Param("id") id: string, @Body() body: { status: string }, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.updateStatus(id, body.status, user.sub);
  }

  @Put(":id/result")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("assessments.manage")
  saveResult(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.saveResult(id, body, user.sub);
  }
}
