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

  @Post("send-link")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("assessments.manage")
  sendTestLink(@Param("caseId") caseId: string, @Req() req: Request) {
    // This is a mock API that simulates sending an email to the parent
    // In a real scenario, this would generate a unique token and call an email service
    const user = (req as any).user;
    console.log(`[Email Service Mock] Sending test link for case ${caseId} by user ${user.sub}`);
    return { success: true, message: "Link-ul a fost trimis cu succes către părinte." };
  }
}
