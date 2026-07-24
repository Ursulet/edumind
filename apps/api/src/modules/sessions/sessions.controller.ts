import { Controller, Get, Patch, Put, Param, Body, UseGuards, Req } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly svc: SessionsService) {}

  @Get("case/:caseId")
  getSessions(@Param("caseId") caseId: string, @Req() req: Request) {
    const user = (req as any).user;
    const isParent = user.permissions?.includes("parent.access") || !user.permissions?.includes("cases.read");
    return this.svc.getSessionsForCase(caseId, user.sub, isParent);
  }

  @Put(":id/content")
  updateContent(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    const isParent = !user.permissions?.includes("cases.read");
    return this.svc.updateSessionContent(id, body, user.sub, isParent);
  }

  @Patch(":id/complete")
  complete(@Param("id") id: string, @Req() req: Request) {
    return this.svc.completeSession(id, (req as any).user.sub);
  }
}
