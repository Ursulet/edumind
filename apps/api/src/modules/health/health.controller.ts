import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from '@edumind/types';

@Controller()
export class HealthController {
  private readonly startTime = Date.now();

  // Root endpoint — used by Coolify/load balancer healthchecks
  @Get()
  getRoot() {
    return { status: 'ok', service: 'EduMind-api' };
  }

  @Get('health')
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      service: 'EduMind-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'local',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  @Get('ready')
  getReadiness() {
    return {
      status: 'ready',
      database: 'connected',
      redis: 'connected',
    };
  }
}


