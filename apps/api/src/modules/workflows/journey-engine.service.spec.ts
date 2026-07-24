import { describe, it, expect, beforeEach, vi } from "vitest";
import { JourneyEngineService } from "./journey-engine.service";

describe("JourneyEngineService", () => {
  let service: JourneyEngineService;
  let mockPrisma: any;
  let mockAudit: any;

  beforeEach(() => {
    mockPrisma = {
      journeyInstance: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      journeyStepInstance: {
        updateMany: vi.fn(),
      },
      journeyEvent: {
        create: vi.fn(),
      },
      journeyTemplate: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
    };

    mockAudit = {
      logEvent: vi.fn(),
    };

    service = new JourneyEngineService(mockPrisma, mockAudit);
  });

  it("should return default state when no journey instance exists", async () => {
    mockPrisma.journeyInstance.findUnique.mockResolvedValue(null);

    const result = await service.getNextAction("non-existent-case");
    expect(result.currentStepLabel).toBe("Fara flux");
    expect(result.stepType).toBe("WAIT");
    expect(result.progressPercent).toBe(0);
  });

  it("should calculate correct progress percentage based on completed steps", async () => {
    mockPrisma.journeyInstance.findUnique.mockResolvedValue({
      id: "inst-1",
      caseId: "case-1",
      version: {
        steps: [{ id: "s1" }, { id: "s2 font" }, { id: "s3" }, { id: "s4" }],
      },
      stepInstances: [
        { status: "COMPLETED", step: { id: "s1", internalLabel: "Step 1" } },
        { status: "ACTIVE", step: { id: "s2", internalLabel: "Step 2", type: "FORM", responsibleRole: "PARENT" } },
        { status: "PENDING", step: { id: "s3", internalLabel: "Step 3" } },
        { status: "PENDING", step: { id: "s4", internalLabel: "Step 4" } },
      ],
    });

    const result = await service.getNextAction("case-1");
    expect(result.progressPercent).toBe(25);
    expect(result.currentStepLabel).toBe("Step 2");
    expect(result.responsibleRole).toBe("PARENT");
  });
});
