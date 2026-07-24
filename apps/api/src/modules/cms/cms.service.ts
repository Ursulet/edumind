import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class CmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listPages(organizationId: string) {
    return this.prisma.cmsPage.findMany({
      where: { organizationId },
      include: { seo: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getPageBySlug(slug: string, preview = false) {
    const page = await this.prisma.cmsPage.findFirst({
      where: {
        slug,
        status: preview ? undefined : "PUBLISHED",
      },
      include: {
        sections: { orderBy: { order: "asc" } },
        seo: true,
      },
    });

    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  async createPage(organizationId: string, data: {
    title: string;
    slug: string;
  }, actorUserId: string) {
    const existing = await this.prisma.cmsPage.findFirst({
      where: { slug: data.slug, organizationId },
    });
    if (existing) throw new BadRequestException("A page with this slug already exists");

    const page = await this.prisma.cmsPage.create({
      data: {
        organizationId,
        title: data.title,
        slug: data.slug,
        status: "DRAFT",
      },
    });

    await this.audit.logEvent({
      actorUserId,
      organizationId,
      action: "cms.page.created",
      entityType: "CmsPage",
      entityId: page.id,
    });

    return page;
  }

  async publishPage(pageId: string, actorUserId: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { id: pageId },
      include: { sections: true },
    });
    if (!page) throw new NotFoundException("Page not found");

    const latestVer = await this.prisma.cmsPageVersion.findFirst({
      where: { pageId },
      orderBy: { version: "desc" },
    });
    const nextVer = (latestVer?.version ?? 0) + 1;

    await this.prisma.cmsPageVersion.create({
      data: {
        pageId: page.id,
        version: nextVer,
        data: { ...page, sections: page.sections } as any,
        
        createdBy: actorUserId,
      },
    });

    const updated = await this.prisma.cmsPage.update({
      where: { id: pageId },
      data: {
        status: "PUBLISHED",
      },
    });

    await this.audit.logEvent({
      actorUserId,
      action: "cms.page.published",
      entityType: "CmsPage",
      entityId: pageId,
    });

    return updated;
  }

  async upsertSection(pageId: string, sectionData: {
    id?: string;
    type: string;
    data: unknown;
    order: number;
  }, actorUserId: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { id: pageId } });
    if (!page) throw new NotFoundException("Page not found");

    const section = sectionData.id
      ? await this.prisma.cmsSection.update({
          where: { id: sectionData.id },
          data: { data: sectionData.data as any, order: sectionData.order },
        })
      : await this.prisma.cmsSection.create({
          data: {
            pageId,
            type: sectionData.type,
            data: sectionData.data as any,
            order: sectionData.order,
          },
        });

    await this.prisma.cmsPage.update({
      where: { id: pageId },
      data: { updatedAt: new Date(), status: page.status === "PUBLISHED" ? "DRAFT" : page.status },
    });

    return section;
  }

  async deleteSection(sectionId: string, actorUserId: string) {
    return this.prisma.cmsSection.delete({ where: { id: sectionId } });
  }

  async getContentKeys(organizationId: string, locale = "ro-RO") {
    const keys = await this.prisma.contentKey.findMany({
      where: { organizationId, locale },
      orderBy: { key: "asc" },
    });
    return Object.fromEntries(keys.map((k) => [k.key, k.value]));
  }
}
