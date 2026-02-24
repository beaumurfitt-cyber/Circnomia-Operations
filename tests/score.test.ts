import { describe, expect, it } from "vitest";
import { computeNextAction, computePriority } from "@/lib/score";

describe("priority scoring", () => {
  it("computes deterministic score", () => {
    const score = computePriority(
      { industry: "Mining", website: "https://x.com" },
      [{ id: "1", entityId: "a", entityType: "Account", field: "why_now_triggers", valueJson: "regional outage", confidence: 80, sourceIds: "[]", createdAt: new Date() } as any],
      [{ id: "c", accountId: "a", name: "A", title: "COO", email: "a@b.com", phone: "1", linkedinUrl: null, buyingRole: "Unknown", notes: null, createdAt: new Date(), updatedAt: new Date() } as any]
    );
    expect(score.score).toBe(55);
  });

  it("computes next action", () => {
    expect(computeNextAction({ hasEnrichment: false, hasExecContact: false, hasOutreach: false })).toContain("Enrich");
  });
});
