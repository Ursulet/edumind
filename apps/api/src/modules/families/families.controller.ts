import { Controller, Get, Param, UseGuards, Req } from "@nestjs/common";
import { FamiliesService } from "./families.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("families")
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get("mine")
  getMyFamily(@Req() req: Request) {
    const user = (req as any).user;
    return this.familiesService.getFamilyForUser(user.sub);
  }

  @Get("mine/children")
  getMyChildren(@Req() req: Request) {
    const user = (req as any).user;
    return this.familiesService.getChildrenForParent(user.sub);
  }

  @Get(":id")
  getFamily(@Param("id") id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.familiesService.getFamilyById(id, user.sub, user.permissions);
  }
}
