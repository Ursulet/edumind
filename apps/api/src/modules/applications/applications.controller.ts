import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /** Public: submit application */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.applicationsService.createApplication(body);
  }

  /** Director: list all */
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.read")
  findAll(@Req() req: Request) {
    const user = (req as any).user;
    return this.applicationsService.listApplications(user.organizationId);
  }

  /** Director: get one */
  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.read")
  findOne(@Param("id") id: string) {
    return this.applicationsService.getApplication(id);
  }

  /** Director: approve/reject/review */
  @Patch(":id/review")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.manage")
  review(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.applicationsService.reviewApplication(id, body, user.sub, user.organizationId);
  }

  /** Director: convert to case */
  @Post(":id/convert")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cases.create")
  convertToCase(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.applicationsService.convertToCase(id, body, user.sub, user.organizationId);
  }
}
