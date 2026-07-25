import { Controller, Get, Param, Query, UseGuards, Req } from "@nestjs/common";
import { CasesService } from "./cases.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("cases")
@UseGuards(JwtAuthGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions("cases.read")
  findAll(
    @Req() req: Request,
    @Query("status") status?: string,
    @Query("departmentId") departmentId?: string,
  ) {
    const user = (req as any).user;
    return this.casesService.listCases({
      organizationId: user.organizationId,
      userId: user.sub,
      permissions: user.permissions,
      filters: { status, departmentId },
    });
  }

  @Get("mine")
  getCaseForParent(@Req() req: Request) {
    const user = (req as any).user;
    return this.casesService.listCases({
      organizationId: user.organizationId,
      userId: user.sub,
      permissions: user.permissions,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.casesService.getCaseById(id, user.sub, user.permissions);
  }

  @Get(":id/parent-view")
  getParentView(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.casesService.getCaseForParent(id, user.sub);
  }

  @Post(":id/recommendations")
  addRecommendation(@Param("id") id: string, @Req() req: Request, @Body() body: { productId: string, reason: string }) {
    const user = (req as any).user;
    return this.casesService.addRecommendation(id, body.productId, body.reason, user.sub);
  }
}
