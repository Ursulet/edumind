import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
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

  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        parentProfile: true,
        userRoles: { include: { role: true } }
      }
    });
    if (!user) throw new NotFoundException("User not found");

    // Fetch the first organization or fallback
    let orgId = user.userRoles[0]?.organizationId;
    if (!orgId) {
      const defaultOrg = await this.prisma.organization.findFirst();
      if (!defaultOrg) throw new BadRequestException("Nu există nicio organizație în sistem.");
      orgId = defaultOrg.id;
    }

    // Find the role ID
    const roleRecord = await this.prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) throw new NotFoundException(`Role ${role} not found in DB`);

    // Update user role mapping
    if (user.userRoles.length > 0) {
      await this.prisma.userRole.update({
        where: { id: user.userRoles[0].id },
        data: { roleId: roleRecord.id }
      });
    } else {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: roleRecord.id, organizationId: orgId }
      });
    }

    // Create profiles if they don't exist based on new role
    if (role === "PARENT" && !user.parentProfile) {
      // Check if they have a parent profile already
      const existingParent = await this.prisma.parentProfile.findUnique({ where: { userId } });
      if (!existingParent) {
        // Create family and parent profile
        const family = await this.prisma.family.create({
          data: {
            organizationId: orgId,
          }
        });
        await this.prisma.parentProfile.create({
          data: {
            userId,
            familyId: family.id,
            relationship: "PARINTE"
          }
        });
      }
    } else if (["SPECIALIST", "DEPARTMENT_ADMIN"].includes(role)) {
      const existingStaff = await this.prisma.staffProfile.findUnique({ where: { userId } });
      if (!existingStaff) {
        await this.prisma.staffProfile.create({
          data: {
            userId
          }
        });
      }
    }

    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async addChildToParent(parentId: string, childData: { firstName: string; lastName: string; dob?: string }) {
    const parentProfile = await this.prisma.parentProfile.findUnique({ where: { userId: parentId } });
    
    if (!parentProfile) {
      throw new NotFoundException("Parent profile not found. Make sure user is a PARENT first.");
    }

    return this.prisma.childProfile.create({
      data: {
        familyId: parentProfile.familyId,
        firstName: childData.firstName,
        lastName: childData.lastName,
        dateOfBirth: childData.dob ? new Date(childData.dob) : undefined,
      }
    });
  }

  async createUser(userData: any) {
    const argon2 = require('argon2');
    const existing = await this.prisma.user.findUnique({ where: { email: userData.email.toLowerCase().trim() } });
    if (existing) throw new BadRequestException("Email deja folosit!");

    const passwordHash = userData.password ? await argon2.hash(userData.password) : "";
    const user = await this.prisma.user.create({
      data: {
        email: userData.email.toLowerCase().trim(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash,
        status: "ACTIVE"
      }
    });

    const defaultOrg = await this.prisma.organization.findFirst();
    if (!defaultOrg) throw new BadRequestException("Nu există nicio organizație în sistem.");
    const orgId = defaultOrg.id;

    const roleRecord = await this.prisma.role.findUnique({ where: { name: userData.role } });
    if (roleRecord) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: roleRecord.id, organizationId: orgId }
      });
    }

    if (userData.role === "PARENT") {
      const family = await this.prisma.family.create({ data: { organizationId: orgId } });
      await this.prisma.parentProfile.create({ data: { userId: user.id, familyId: family.id, relationship: "PARINTE" } });
      
      if (userData.childFirstName && userData.childLastName) {
        await this.prisma.childProfile.create({
          data: {
            familyId: family.id,
            firstName: userData.childFirstName,
            lastName: userData.childLastName,
            dateOfBirth: userData.childDob ? new Date(userData.childDob) : undefined,
          }
        });
      }
    } else if (["SPECIALIST", "DEPARTMENT_ADMIN"].includes(userData.role)) {
      await this.prisma.staffProfile.create({
        data: {
          userId: user.id
        }
      });
    }

    return user;
  }
}
