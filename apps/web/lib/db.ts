import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// SAFE MOCK PRISMA (For local testing without a real Postgres DB)
const createMockPrisma = () => {
  return new Proxy({}, {
    get(target, prop) {
      if (prop === '$queryRaw') return async () => [{ 1: 1 }];
      if (prop === '$transaction') return async (cb: any) => cb(createMockPrisma());
      
      return new Proxy({}, {
        get(model, action) {
          if (action === 'findMany') return async () => [];
          if (action === 'findUnique' || action === 'findFirst') return async () => null;
          if (action === 'create' || action === 'update' || action === 'delete') return async () => ({ id: 'mock-id' });
          if (action === 'count') return async () => 0;
          return async () => null;
        }
      });
    }
  }) as any as PrismaClient;
};

export const prisma = process.env.DATABASE_URL 
  ? (globalForPrisma.prisma || new PrismaClient())
  : createMockPrisma();

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}
