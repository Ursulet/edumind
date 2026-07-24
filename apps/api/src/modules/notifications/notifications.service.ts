import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService, 
    private audit: AuditService,
    @InjectQueue('email-queue') private emailQueue: Queue
  ) {}

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
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        category: data.category,
        actionTarget: data.actionTarget,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: data.userId }});
    if (user && user.email) {
      await this.emailQueue.add('send-email', {
        id: notification.id,
        recipientEmail: user.email,
        subject: data.title,
        bodyContent: data.message,
        variables: {}
      });
    }

    return notification;
  }
}
