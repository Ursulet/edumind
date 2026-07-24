import { describe, it, expect, beforeEach, vi } from "vitest";
import { EntitlementActivationService } from "./entitlement-activation.service";

describe("EntitlementActivationService", () => {
  let service: EntitlementActivationService;
  let mockPrisma: any;
  let mockAudit: any;

  beforeEach(() => {
    mockPrisma = {
      order: {
        findUnique: vi.fn(),
      },
      sessionType: {
        findFirst: vi.fn(),
      },
      sessionCredit: {
        create: vi.fn(),
      },
    };

    mockAudit = {
      logEvent: vi.fn(),
    };

    service = new EntitlementActivationService(mockPrisma, mockAudit);
  });

  it("should throw error if order does not exist", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null);
    await expect(service.activateEntitlementsForOrder("invalid-id")).rejects.toThrow("Order invalid-id not found");
  });

  it("should create session credits for SESSION_CREDIT entitlements in order items", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      id: "ord-1",
      familyId: "fam-1",
      childId: "child-1",
      items: [
        {
          snapshotEntitlements: [
            { type: "SESSION_CREDIT", quantity: 3, validityDays: 90 },
          ],
        },
      ],
    });

    mockPrisma.sessionType.findFirst.mockResolvedValue({ id: "st-default" });
    mockPrisma.sessionCredit.create.mockResolvedValue({ id: "cred-1", status: "AVAILABLE" });

    const result = await service.activateEntitlementsForOrder("ord-1", "user-admin");
    expect(result.activated).toBe(true);
    expect(mockPrisma.sessionCredit.create).toHaveBeenCalledTimes(3);
    expect(mockAudit.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "order.entitlements.activated" })
    );
  });
});
