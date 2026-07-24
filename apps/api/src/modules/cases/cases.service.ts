import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listCases(params: {
    organizationId: string;
    userId: string;
    permissions: string[];
    filters?: { status?: string; departmentId?: string };
  }) {
    const isAdmin = params.permissions.some(p => ["system.manage", "cases.read"].includes(p));
    const isSpecialist = params.permissions.includes("cases.read.assigned");

    let staffFilter = {};
    if (isSpecialist && !isAdmin) {
      const staff = await this.prisma.staffProfile.findUnique({ where: { userId: params.userId } });
      if (staff) {
        staffFilter = { assignments: { some: { staffId: staff.id } } };
      }
    }

    return this.prisma.careerCase.findMany({
      where: {
        child: { family: { organizationId: params.organizationId } },
        status: params.filters?.status as any,
        departmentId: params.filters?.departmentId,
        ...staffFilter,
      },
      include: {
        child: { include: { family: { include: { parents: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } } } } },
        assignments: {
          include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
        },
        journeyInstance: {
          include: {
            stepInstances: { include: { step: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCaseById(caseId: string, requestingUserId: string, permissions: string[]) {
    const isAdmin = permissions.some(p => ["system.manage", "cases.read"].includes(p));

    const careerCase = await this.prisma.careerCase.findUnique({
      where: { id: caseId },
      include: {
        child: { include: { family: { include: { parents: { include: { user: true } } } } } },
        department: true,
        assignments: {
          include: { staff: { include: { user: true } } },
        },
        journeyInstance: {
          include: {
            version: { include: { steps: { orderBy: { order: "asc" } } } },
            stepInstances: { include: { step: true } },
          },
        },
        assessments: {
          include: { result: true },
          orderBy: { assignedAt: "desc" },
        },
        reports: { orderBy: { createdAt: "desc" } },
        counselingSessions: {
          include: {
            appointment: true,
            content: true,
          },
          orderBy: { createdAt: "desc" },
        },
        recommendations: {
          include: { productVersion: { include: { prices: { take: 1 } } } },
        },
        careerPlans: { take: 1, orderBy: { version: "desc" } },
        activities: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!careerCase) throw new NotFoundException("Case not found");

    if (!isAdmin) {
      const parent = await this.prisma.parentProfile.findFirst({
        where: { userId: requestingUserId, familyId: careerCase.child.familyId },
      });
      const isAssigned = careerCase.assignments.some(a => a.staff?.userId === requestingUserId);

      if (!parent && !isAssigned) {
        throw new ForbiddenException("Access denied to this case");
      }
    }

    return careerCase;
  }

  async getCaseForParent(caseId: string, userId: string) {
    const careerCase = await this.prisma.careerCase.findUnique({
      where: { id: caseId },
      include: {
        child: { include: { family: true } },
        journeyInstance: {
          include: {
            stepInstances: { include: { step: true } },
          },
        },
        assignments: {
          where: { role: "PRIMARY_SPECIALIST" },
          include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
        },
        counselingSessions: {
          where: { status: "SCHEDULED" },
          include: { appointment: true },
          take: 1,
        },
        reports: { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 5 },
        recommendations: {
          where: { status: { in: ["RECOMMENDED", "VIEWED", "ACCEPTED"] } },
          include: { productVersion: { include: { prices: { take: 1 } } }, staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
        },
        activities: { where: { isPublic: true }, orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!careerCase) throw new NotFoundException("Case not found");

    const parent = await this.prisma.parentProfile.findFirst({
      where: { userId, familyId: careerCase.child.familyId },
    });
    if (!parent) throw new ForbiddenException("Access denied");

    const sanitizedSessions = careerCase.counselingSessions.map(s => ({
      ...s,
      content: undefined,
    }));

    return { ...careerCase, counselingSessions: sanitizedSessions };
  }
}
