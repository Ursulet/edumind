import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("audit.read")
  async getAuditLogs(
    @Query("limit") limit: string = "50",
    @Query("offset") offset: string = "0",
    @Req() req: Request
  ) {
    const user = (req as any).user;
    
    // In a real app we'd inject PrismaService and query it directly here, 
    // but we can add a method to AuditService.
    return this.auditService.getLogs(Number(limit), Number(offset));
  }
}
