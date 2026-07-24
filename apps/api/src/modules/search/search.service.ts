import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, organizationId: string, permissions: string[]) {
    if (!query || query.trim().length < 2) return { cases: [], families: [] };

    const q = query.trim();

    const cases = await this.prisma.careerCase.findMany({
      where: {
        child: { family: { organizationId } },
        OR: [
          { publicId: { contains: q, mode: "insensitive" } },
          { child: { firstName: { contains: q, mode: "insensitive" } } },
          { child: { lastName: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: { child: true },
      take: 5,
    });

    const families = await this.prisma.family.findMany({
      where: {
        organizationId,
        parents: {
          some: {
            user: {
              OR: [
                { firstName: { contains: q, mode: "insensitive" } },
                { lastName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      },
      include: { parents: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
      take: 5,
    });

    return { cases, families };
  }
}
