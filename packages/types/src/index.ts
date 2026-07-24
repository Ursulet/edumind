/**
 * Core Domain & API Types for EduCarieră Platform
 */

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
  };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  version: string;
  timestamp: string;
  environment: string;
  uptime: number;
}

export type UserRole =
  | 'PLATFORM_OWNER'
  | 'SUPER_ADMIN'
  | 'DEPARTMENT_ADMIN'
  | 'SPECIALIST'
  | 'PARENT';

export interface UserSession {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  permissions: string[];
}
