import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listProducts(organizationId: string) {
    return this.prisma.product.findMany({
      where: {
        organizationId,
      },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          include: { prices: true, entitlements: { include: { entitlement: true } } },
        },
        
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          include: { prices: true, entitlements: { include: { entitlement: true } } },
        },
        
      },
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async createProduct(organizationId: string, data: {
    category: string;
  }, actorUserId: string) {
    const product = await this.prisma.product.create({
      data: {
        organizationId,
        category: data.category as any,
      },
    });

    await this.audit.logEvent({
      actorUserId,
      organizationId,
      action: "catalog.product.created",
      entityType: "Product",
      entityId: product.id,
    });

    return product;
  }

  async createProductVersion(productId: string, data: {
    marketingName: string;
    internalName: string;
    description?: string;
    benefits?: string[];
  }, actorUserId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    });
    if (!product) throw new NotFoundException("Product not found");

    const nextVersion = (product.versions[0]?.version ?? 0) + 1;

    const version = await this.prisma.productVersion.create({
      data: {
        productId,
        version: nextVersion,
        marketingName: data.marketingName,
        internalName: data.internalName,
        description: data.description,
        benefits: data.benefits ?? [],
        status: "DRAFT",
      },
    });

    return version;
  }

  async publishProductVersion(versionId: string, actorUserId: string) {
    const version = await this.prisma.productVersion.findUnique({ where: { id: versionId } });
    if (!version) throw new NotFoundException("Version not found");
    if (version.status === "PUBLISHED") throw new BadRequestException("Version is already published");

    const updated = await this.prisma.productVersion.update({
      where: { id: versionId },
      data: { status: "PUBLISHED" },
    });

    await this.audit.logEvent({
      actorUserId,
      action: "catalog.version.published",
      entityType: "ProductVersion",
      entityId: versionId,
    });

    return updated;
  }

  async getCommercialSnapshot(productVersionId: string) {
    const version = await this.prisma.productVersion.findUnique({
      where: { id: productVersionId },
      include: {
        prices: { take: 1 },
        entitlements: { include: { entitlement: true } },
        product: true,
      },
    });
    if (!version) throw new NotFoundException("Product version not found");
    if (version.status !== "PUBLISHED") throw new BadRequestException("Only published versions can be ordered");

    return {
      productId: version.productId,
      productVersionId: version.id,
      productVersionNumber: version.version,
      snapshotName: version.marketingName,
      snapshotDescription: version.description,
      snapshotAmount: version.prices[0]?.amount ? Number(version.prices[0].amount) : 0,
      snapshotCurrency: version.prices[0]?.currency ?? "RON",
      snapshotEntitlements: version.entitlements.map(e => ({
        type: e.entitlement.type,
        quantity: e.quantity,
        validityDays: (e.entitlement.metadata as any)?.validityDays,
      })),
    };
  }
}
