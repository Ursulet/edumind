import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface TimeSlot {
  start: Date;
  end: Date;
  staffId: string;
}

@Injectable()
export class SlotGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(params: {
    staffId: string;
    date: Date;
    durationMin: number;
    preBufferMin: number;
    postBufferMin: number;
    organizationTimezone?: string;
  }): Promise<TimeSlot[]> {
    const { staffId, date, durationMin, preBufferMin, postBufferMin } = params;

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    const exception = await this.prisma.staffAvailabilityException.findFirst({
      where: { staffId, date: { gte: new Date(`${dateStr}T00:00:00Z`), lt: new Date(`${dateStr}T23:59:59Z`) } },
    });

    const blackout = await this.prisma.blackoutPeriod.findFirst({
      where: {
        startDate: { lte: new Date(dateStr) },
        endDate: { gte: new Date(dateStr) },
      },
    });

    if (blackout) return [];
    if (exception && !exception.isAvailable) return [];

    const rule = await this.prisma.staffAvailabilityRule.findFirst({
      where: { staffId, dayOfWeek },
    });

    if (!rule && !exception) return [];

    const workStart = exception?.startTime ?? rule?.startTime ?? "09:00";
    const workEnd = exception?.endTime ?? rule?.endTime ?? "17:00";

    const [sh, sm] = workStart.split(":").map(Number);
    const [eh, em] = workEnd.split(":").map(Number);

    const baseDate = new Date(dateStr);
    const dayStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), sh, sm);
    const dayEnd = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), eh, em);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        staffId,
        startTime: { gte: dayStart },
        endTime: { lte: new Date(dayEnd.getTime() + 2 * 3600_000) },
        status: { not: "CANCELLED" },
      },
    });

    const slotDurationMs = (preBufferMin + durationMin + postBufferMin) * 60_000;
    const slots: TimeSlot[] = [];
    let cursor = dayStart;

    while (cursor.getTime() + slotDurationMs <= dayEnd.getTime()) {
      const slotStart = new Date(cursor.getTime() + preBufferMin * 60_000);
      const slotEnd = new Date(slotStart.getTime() + durationMin * 60_000);

      const blocked = existingAppointments.some(
        (apt) => !(slotEnd <= apt.startTime || slotStart >= apt.endTime),
      );

      if (!blocked) {
        slots.push({ start: slotStart, end: slotEnd, staffId });
      }

      cursor = new Date(cursor.getTime() + slotDurationMs);
    }

    return slots;
  }
}
