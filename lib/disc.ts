import { z } from "zod";

export const discSchema = z.object({
  type: z.enum(["D", "I", "S", "C", "Unknown"]),
  confidence: z.number().int().min(0).max(100),
  evidence: z.array(z.object({ claim: z.string(), source_url: z.string().url() })),
  recommended_playbook: z.object({
    tone: z.string(),
    meeting_structure: z.array(z.string()),
    do: z.array(z.string()),
    dont: z.array(z.string()),
    objection_style: z.array(z.string())
  }),
  disclaimer: z.string()
});

export type DiscPayload = z.infer<typeof discSchema>;

export function normalizeDisc(payload: DiscPayload): DiscPayload {
  if (payload.evidence.length < 2) {
    return { ...payload, type: "Unknown", confidence: Math.min(payload.confidence, 40) };
  }
  return payload;
}
