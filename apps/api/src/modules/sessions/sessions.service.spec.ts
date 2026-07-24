import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: {
            counselingSession: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              update: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch staff sessions', async () => {
    (prisma.counselingSession.findMany as any).mockResolvedValue([{ id: 'sess-1' }]);
    
    const result = await service.getStaffSessions('staff-1');
    expect(result).toEqual([{ id: 'sess-1' }]);
    expect(prisma.counselingSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          appointment: { staffId: 'staff-1' }
        })
      })
    );
  });
});
