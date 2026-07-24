import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== userId) throw new NotFoundException("Notification not found");

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    category: any;
    actionTarget?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        category: data.category,
        actionTarget: data.actionTarget,
      },
    });
  }
}
