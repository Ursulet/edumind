import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface CreateAuditEventDto {
  actorUserId?: string;
  organizationId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  requestId?: string;
  ipAddress?: string;
  sessionId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Immutable logging of audit events.
   * No deletion or modification methods are exposed by this service.
   */
  async logEvent(dto: CreateAuditEventDto): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          actorUserId: dto.actorUserId,
          organizationId: dto.organizationId,
          action: dto.action,
          entityType: dto.entityType,
          entityId: dto.entityId,
          requestId: dto.requestId,
          ipAddress: dto.ipAddress,
          sessionId: dto.sessionId,
          before: dto.before as Prisma.InputJsonValue,
          after: dto.after as Prisma.InputJsonValue,
          metadata: dto.metadata as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      // Audit failure must be logged to error stream without crashing caller
      console.error('❌ Failed to persist audit event:', error, dto);
    }
  }

  async getLogs(limit: number = 50, offset: number = 0) {
    return this.prisma.auditEvent.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }
}
