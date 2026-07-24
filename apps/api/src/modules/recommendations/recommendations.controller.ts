import { Controller, Post, Patch, Param, Body, UseGuards, Req } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("recommendations")
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private readonly svc: RecommendationsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions("recommendations.create")
  create(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.createRecommendation(body.caseId, { ...body, actorUserId: user.sub });
  }

  @Patch(":id/accept")
  accept(@Param("id") id: string, @Req() req: Request) {
    return this.svc.respondToRecommendation(id, "ACCEPTED", (req as any).user.sub);
  }

  @Patch(":id/decline")
  decline(@Param("id") id: string, @Req() req: Request) {
    return this.svc.respondToRecommendation(id, "DECLINED", (req as any).user.sub);
  }
}
