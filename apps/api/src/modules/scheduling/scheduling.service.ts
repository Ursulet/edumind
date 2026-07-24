import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { SlotGeneratorService } from "./slot-generator.service";

@Injectable()
export class SchedulingService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private slotGenerator: SlotGeneratorService,
  ) {}

  async getAvailableSlots(staffId: string, date: string, appointmentTypeId: string) {
    const apptType = await this.prisma.appointmentType.findUnique({ where: { id: appointmentTypeId } });
    if (!apptType) throw new NotFoundException("Appointment type not found");

    return this.slotGenerator.getAvailableSlots({
      staffId,
      date: new Date(date),
      durationMin: apptType.durationMin,
      preBufferMin: apptType.preBufferMin,
      postBufferMin: apptType.postBufferMin,
    });
  }

  async bookAppointment(data: {
    staffId: string;
    caseId: string;
    typeId: string;
    startTime: string;
    endTime: string;
    actorUserId: string;
    organizationId: string;
  }) {
    // Verify slot is still available (concurrency protection with transaction)
    const appointment = await this.prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          staffId: data.staffId,
          status: { not: "CANCELLED" },
          OR: [
            { startTime: { gte: new Date(data.startTime), lt: new Date(data.endTime) } },
            { endTime: { gt: new Date(data.startTime), lte: new Date(data.endTime) } },
          ],
        },
      });

      if (conflict) throw new BadRequestException("Slot no longer available — another booking was made concurrently");

      return tx.appointment.create({
        data: {
          typeId: data.typeId,
          staffId: data.staffId,
          caseId: data.caseId,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          status: "SCHEDULED",
          statusHistory: {
            create: { status: "SCHEDULED", changedById: data.actorUserId },
          },
          videoMeeting: {
            create: {
              provider: "MOCK",
              joinUrl: `https://meet.example.com/join/${Math.random().toString(36).slice(2)}`,
              hostUrl: `https://meet.example.com/host/${Math.random().toString(36).slice(2)}`,
            },
          },
        },
        include: { videoMeeting: true, type: true },
      });
    });

    await this.audit.logEvent({
      actorUserId: data.actorUserId,
      organizationId: data.organizationId,
      action: "appointment.booked",
      entityType: "Appointment",
      entityId: appointment.id,
    });

    return appointment;
  }

  async cancelAppointment(appointmentId: string, reason: string, actorUserId: string) {
    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new NotFoundException("Appointment not found");

    await this.prisma.appointmentStatusHistory.create({
      data: { appointmentId, status: "CANCELLED", reason, changedById: actorUserId },
    });

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });
  }

  async getUpcomingForCase(caseId: string) {
    return this.prisma.appointment.findMany({
      where: { caseId, status: "SCHEDULED", startTime: { gte: new Date() } },
      include: {
        type: true,
        videoMeeting: true,
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    });
  }
}
