import { Controller, Get, Patch, Param, UseGuards, Req } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  getMine(@Req() req: Request) {
    const user = (req as any).user;
    return this.svc.getUserNotifications(user.sub);
  }

  @Patch(":id/read")
  markAsRead(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.markAsRead(id, user.sub);
  }
}
