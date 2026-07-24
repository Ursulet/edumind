import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("products")
  listProducts(@Query("org") org: string) {
    return this.catalogService.listProducts(org);
  }

  @Get("products/:id")
  getProduct(@Param("id") id: string) {
    return this.catalogService.getProductById(id);
  }

  @Post("products")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("catalog.manage")
  createProduct(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.catalogService.createProduct(user.organizationId, body, user.sub);
  }

  @Post("products/:id/versions")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("catalog.manage")
  createVersion(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.catalogService.createProductVersion(id, body, user.sub);
  }

  @Patch("versions/:id/publish")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("catalog.manage")
  publishVersion(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.catalogService.publishProductVersion(id, user.sub);
  }
}
