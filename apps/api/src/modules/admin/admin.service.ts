import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        parentProfile: { include: { family: { include: { children: true } } } },
        staffProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateUserRole(userId: string, role: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Create profiles if they don't exist based on new role
    if (role === "PARENT" && !user.parentProfile) {
      // Check if they have a parent profile already
      const existingParent = await this.prisma.parentProfile.findUnique({ where: { userId } });
      if (!existingParent) {
        // Create family and parent profile
        const family = await this.prisma.family.create({
          data: {
            organizationId: user.organizationId,
          }
        });
        await this.prisma.parentProfile.create({
          data: {
            userId,
            familyId: family.id,
            relationshipToChild: "PARINTE"
          }
        });
      }
    } else if (["SPECIALIST", "DEPARTMENT_ADMIN"].includes(role)) {
      const existingStaff = await this.prisma.staffProfile.findUnique({ where: { userId } });
      if (!existingStaff) {
        await this.prisma.staffProfile.create({
          data: {
            userId,
            organizationId: user.organizationId || "", // requires organizationId
            capacity: 20
          }
        });
      }
    }

    return updatedUser;
  }

  async addChildToParent(parentId: string, childData: { firstName: string; lastName: string; dob?: string }) {
    const parentProfile = await this.prisma.parentProfile.findUnique({ where: { userId: parentId } });
    
    if (!parentProfile) {
      throw new NotFoundException("Parent profile not found. Make sure user is a PARENT first.");
    }

    return this.prisma.child.create({
      data: {
        familyId: parentProfile.familyId,
        firstName: childData.firstName,
        lastName: childData.lastName,
        dateOfBirth: childData.dob ? new Date(childData.dob) : undefined,
      }
    });
  }
}
