import { HealthCheckResponse } from '@educariera/types';

export class EduCarieraApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api/v1') {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<HealthCheckResponse> {
    const res = await fetch(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return res.json();
  }
}

export * from './payment';
export * from './workflow';
export * from './video';
