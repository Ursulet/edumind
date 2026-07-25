import { Controller, Get, Patch, Post, Param, Body, UseGuards, Req } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";

@Controller("admin")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions("system.manage") // Only SUPER_ADMIN and PLATFORM_OWNER have this
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  @Get("users")
  getUsers() {
    return this.svc.getAllUsers();
  }

  @Patch("users/:id/role")
  updateUserRole(@Param("id") id: string, @Body("role") role: any) {
    return this.svc.updateUserRole(id, role);
  }

  @Post("users/:parentId/children")
  addChildToParent(@Param("parentId") parentId: string, @Body() childData: any) {
    return this.svc.addChildToParent(parentId, childData);
  }

  @Post("users/create")
  createUser(@Body() userData: any) {
    return this.svc.createUser(userData);
  }
}
