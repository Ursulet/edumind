import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Req } from "@nestjs/common";
import { SchedulingService } from "./scheduling.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("scheduling")
@UseGuards(JwtAuthGuard)
export class SchedulingController {
  constructor(private readonly svc: SchedulingService) {}

  @Get("slots")
  getSlots(@Query("staffId") staffId: string, @Query("date") date: string, @Query("typeId") typeId: string) {
    return this.svc.getAvailableSlots(staffId, date, typeId);
  }

  @Post("appointments")
  bookAppointment(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.bookAppointment({ ...body, actorUserId: user.sub, organizationId: user.organizationId });
  }

  @Get("my-appointments")
  getMyAppointments(@Req() req: Request) {
    const user = (req as any).user;
    return this.svc.getMyAppointments(user.sub, user.role);
  }

  @Delete("appointments/:id")
  cancelAppointment(@Param("id") id: string, @Body() body: { reason: string }, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.cancelAppointment(id, body.reason, user.sub);
  }

  @Get("appointments/case/:caseId")
  getForCase(@Param("caseId") caseId: string) {
    return this.svc.getUpcomingForCase(caseId);
  }
}
