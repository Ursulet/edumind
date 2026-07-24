import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from "@nestjs/common";
import { JourneyEngineService } from "./journey-engine.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("journeys")
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly journeyEngine: JourneyEngineService) {}

  @Get("templates")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("workflows.read")
  listTemplates(@Req() req: Request) {
    const user = (req as any).user;
    return this.journeyEngine.listTemplates(user.organizationId);
  }

  @Post("templates")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("workflows.manage")
  createTemplate(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.journeyEngine.createTemplate(user.organizationId, body, user.sub);
  }

  @Patch("versions/:id/publish")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("workflows.manage")
  publishVersion(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.journeyEngine.publishVersion(id, user.sub);
  }

  @Get("instances/:caseId/next-action")
  getNextAction(@Param("caseId") caseId: string) {
    return this.journeyEngine.getNextAction(caseId);
  }

  @Post("instances/:caseId/complete-step")
  @UseGuards(PermissionsGuard)
  @RequirePermissions("cases.manage")
  completeStep(@Param("caseId") caseId: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.journeyEngine.completeStep({
      caseId,
      stepId: body.stepId,
      actorUserId: user.sub,
      completionData: body.data,
    });
  }
}
