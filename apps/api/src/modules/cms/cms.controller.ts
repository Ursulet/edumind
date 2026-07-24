import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, UseGuards, Req,
} from "@nestjs/common";
import { CmsService } from "./cms.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../permissions/guards/permissions.guard";
import { RequirePermissions } from "../permissions/decorators/permissions.decorator";
import { Request } from "express";

@Controller("cms")
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  /** Public: get published page by slug */
  @Get("pages/by-slug/:slug")
  getPageBySlug(
    @Param("slug") slug: string,
    @Query("preview") preview?: string,
  ) {
    return this.cmsService.getPageBySlug(slug, preview === "true");
  }

  /** Admin: list all pages */
  @Get("pages")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cms.read")
  listPages(@Req() req: Request) {
    const user = (req as any).user;
    return this.cmsService.listPages(user.organizationId);
  }

  /** Admin: create page */
  @Post("pages")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cms.manage")
  createPage(@Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.cmsService.createPage(user.organizationId, body, user.sub);
  }

  /** Admin: publish a page */
  @Patch("pages/:id/publish")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cms.manage")
  publishPage(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.cmsService.publishPage(id, user.sub);
  }

  /** Admin: upsert section */
  @Put("pages/:id/sections")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cms.manage")
  upsertSection(@Param("id") id: string, @Body() body: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.cmsService.upsertSection(id, body, user.sub);
  }

  /** Admin: delete section */
  @Delete("sections/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("cms.manage")
  deleteSection(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.cmsService.deleteSection(id, user.sub);
  }

  /** Public: get content keys */
  @Get("content-keys")
  getContentKeys(@Query("org") organizationId: string, @Query("locale") locale?: string) {
    return this.cmsService.getContentKeys(organizationId, locale);
  }
}
