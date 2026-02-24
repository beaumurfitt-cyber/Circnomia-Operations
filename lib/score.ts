import { Enrichment, Contact } from "@prisma/client";

const targetIndustries = ["Mining", "Water", "Council", "Energy"];
const execRegex = /(COO|GM Ops|CIO|Head of Innovation)/i;

export function computePriority(account: {
  industry: string;
  website?: string | null;
}, enrichments: Enrichment[], contacts: Contact[]) {
  let fit = 0;
  let urgency = 0;
  let access = 0;

  if (targetIndustries.includes(account.industry)) fit += 15;
  if (enrichments.some((e) => /remote|regional/i.test(e.valueJson))) fit += 10;
  if (account.website) fit += 5;

  const triggerRows = enrichments.filter((e) => e.field === "why_now_triggers");
  urgency = Math.min(40, triggerRows.length * 10);

  const execContact = contacts.find((c) => execRegex.test(c.title));
  if (execContact) access += 10;
  if (contacts.some((c) => Boolean(c.email))) access += 5;
  if (contacts.some((c) => Boolean(c.phone))) access += 5;

  return {
    score: fit + urgency + access,
    detail: { fit, urgency, access }
  };
}

export function computeNextAction(params: {
  hasEnrichment: boolean;
  hasExecContact: boolean;
  hasOutreach: boolean;
}) {
  if (!params.hasEnrichment) return "Enrich account with 2–3 URLs";
  if (!params.hasExecContact) return "Add exec contact (COO/CIO/GM Ops)";
  if (!params.hasOutreach) return "Generate outreach sequence";
  return "Schedule 15-min problem interview";
}
