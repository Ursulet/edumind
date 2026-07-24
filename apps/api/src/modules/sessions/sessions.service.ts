import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async getSessionsForCase(caseId: string, requestingUserId: string, isParent: boolean) {
    const sessions = await this.prisma.counselingSession.findMany({
      where: { caseId },
      include: {
        content: true,
        appointment: { include: { type: true, videoMeeting: true } },
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (isParent) {
      return sessions.map((s) => ({
        ...s,
        content: s.content
          ? {
              id: s.content.id,
              parentSummary: s.content.parentSummary,
              homework: s.content.homework,
              nextSteps: s.content.nextSteps,
            }
          : null,
      }));
    }

    return sessions;
  }

  async updateSessionContent(
    sessionId: string,
    data: { internalNotes?: string; parentSummary?: string; homework?: string; nextSteps?: string },
    actorUserId: string,
    isParent: boolean,
  ) {
    if (isParent) throw new ForbiddenException("Parents cannot edit session notes");

    const session = await this.prisma.counselingSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException("Session not found");

    const updateData: any = {};
    if (data.parentSummary !== undefined) updateData.parentSummary = data.parentSummary;
    if (data.homework !== undefined) updateData.homework = data.homework;
    if (data.nextSteps !== undefined) updateData.nextSteps = data.nextSteps;
    if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes;

    const existing = await this.prisma.sessionContent.findUnique({ where: { sessionId } });
    const content = existing
      ? await this.prisma.sessionContent.update({ where: { id: existing.id }, data: updateData })
      : await this.prisma.sessionContent.create({ data: { sessionId, ...updateData } });

    await this.audit.logEvent({ actorUserId, action: "session.content_updated", entityType: "SessionContent", entityId: content.id });
    return content;
  }

  async completeSession(sessionId: string, actorUserId: string) {
    const session = await this.prisma.counselingSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException("Session not found");

    const updated = await this.prisma.counselingSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED", actualEnd: new Date(), completedAt: new Date() },
    });

    if (session.consumedCreditId) {
      await this.prisma.sessionCredit.update({
        where: { id: session.consumedCreditId },
        data: { status: "CONSUMED", consumedAt: new Date() },
      });
    }

    await this.audit.logEvent({ actorUserId, action: "session.completed", entityType: "CounselingSession", entityId: sessionId });
    return updated;
  }
}
