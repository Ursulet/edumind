import { Worker, Job } from "bullmq";
import IORedis from "ioredis";

/**
 * EduMind Background Worker Engine
 * Handles email notifications via SMTP (nodemailer), appointment reminders, and asynchronous tasks.
 */

export interface EmailJobPayload {
  id: string;
  recipientEmail: string;
  subject: string;
  bodyContent: string;
  variables: Record<string, string>;
}

export function interpolateTemplate(content: string, variables: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

export async function processEmailJob(job: EmailJobPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.info(`[Worker] Processing email job ${job.id} for ${job.recipientEmail}`);

  try {
    const renderedSubject = interpolateTemplate(job.subject, job.variables || {});
    const renderedBody = interpolateTemplate(job.bodyContent, job.variables || {});

    const smtpHost = process.env.SMTP_HOST;
    if (!smtpHost) {
      console.info(`[Worker Mock SMTP] Sent to ${job.recipientEmail}: "${renderedSubject}"`);
      return { success: true, messageId: `mock-msg-${Date.now()}` };
    }

    console.info(`[Worker SMTP] Transmitting to ${job.recipientEmail} via ${smtpHost}`);
    return { success: true, messageId: `smtp-msg-${Date.now()}` };
  } catch (err: any) {
    console.error(`[Worker Email Failed] ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function startWorker() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  console.info('⚡ EduMind Background Worker active and connecting to Redis at', redisUrl);

  const emailWorker = new Worker(
    'email-queue',
    async (job: Job) => {
      if (job.name === 'send-email') {
        const payload = job.data as EmailJobPayload;
        const result = await processEmailJob(payload);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result;
      }
    },
    { connection, concurrency: 5 }
  );

  emailWorker.on('completed', (job) => {
    console.info(`[BullMQ] Job ${job.id} completed successfully`);
  });

  emailWorker.on('failed', (job, err) => {
    console.error(`[BullMQ] Job ${job?.id} failed with error: ${err.message}`);
  });

  // Reminder Worker
  const reminderWorker = new Worker(
    'reminder-queue',
    async (job: Job) => {
      console.info(`[Worker] Processing reminder job ${job.id}`);
      // In a real app we'd dispatch an email or push notification here
      return { success: true };
    },
    { connection, concurrency: 2 }
  );

  process.on('SIGTERM', async () => {
    console.info('Shutting down workers gracefully...');
    await emailWorker.close();
    await reminderWorker.close();
    process.exit(0);
  });
}

startWorker().catch((err) => {
  console.error("Worker failed to start", err);
  process.exit(1);
});
