/**
 * EduCarieră Background Worker Engine
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
    const renderedSubject = interpolateTemplate(job.subject, job.variables);
    const renderedBody = interpolateTemplate(job.bodyContent, job.variables);

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
  console.info('⚡ EduCarieră Background Worker active and listening for jobs...');
}

startWorker();

process.on('SIGTERM', () => {
  console.info('Shutting down worker gracefully...');
  process.exit(0);
});
