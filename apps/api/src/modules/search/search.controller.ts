import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { SearchService } from "./search.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly svc: SearchService) {}

  @Get()
  search(@Query("q") q: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.svc.globalSearch(q, user.organizationId, user.permissions);
  }
}
