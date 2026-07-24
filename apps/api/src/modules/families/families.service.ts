import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFamilyForUser(userId: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        family: {
          include: {
            children: true,
            parents: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          },
        },
      },
    });
    if (!parent?.family) throw new NotFoundException("No family found for this user");
    return parent.family;
  }

  async getFamilyById(familyId: string, requestingUserId: string, permissions: string[]) {
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        children: {
          include: {
            cases: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        parents: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      },
    });

    if (!family) throw new NotFoundException("Family not found");

    // Data access control
    const isSuperAdmin = permissions.includes("system.manage") || permissions.includes("cases.read");
    if (!isSuperAdmin) {
      const parent = await this.prisma.parentProfile.findFirst({
        where: { userId: requestingUserId, familyId },
      });
      if (!parent) throw new ForbiddenException("Access denied to this family");
    }

    return family;
  }

  async getChildrenForParent(userId: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId },
      include: { family: { include: { children: true } } },
    });
    return parent?.family?.children ?? [];
  }
}
