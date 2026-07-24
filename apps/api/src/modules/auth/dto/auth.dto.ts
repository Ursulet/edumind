import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const impersonateSchema = z.object({
  targetUserId: z.string().uuid(),
  reason: z.string().min(10),
});

export type ImpersonateDto = z.infer<typeof impersonateSchema>;
