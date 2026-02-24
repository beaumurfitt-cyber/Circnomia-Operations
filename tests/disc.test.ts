import { describe, expect, it } from "vitest";
import { discSchema, normalizeDisc } from "@/lib/disc";

describe("disc schema", () => {
  it("enforces unknown when evidence too low", () => {
    const parsed = discSchema.parse({
      type: "D",
      confidence: 70,
      evidence: [{ claim: "Role indicates fast decisions", source_url: "https://example.com" }],
      recommended_playbook: { tone: "Direct", meeting_structure: ["A"], do: ["B"], dont: ["C"], objection_style: ["D"] },
      disclaimer: "Communication-style hypothesis only..."
    });
    const normalized = normalizeDisc(parsed);
    expect(normalized.type).toBe("Unknown");
    expect(normalized.confidence).toBeLessThanOrEqual(40);
  });
});
