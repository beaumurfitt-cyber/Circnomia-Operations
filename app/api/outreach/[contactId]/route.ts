import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateJson } from "@/lib/llmClient";

export async function POST(_: Request, { params }: { params: { contactId: string } }) {
  const contact = await prisma.contact.findUnique({ where: { id: params.contactId }, include: { account: true, discProfile: true } });
  if (!contact) return NextResponse.json({ error: "not found" }, { status: 404 });

  const fallback = {
    Email: {
      Direct: `Hi ${contact.name}, I noticed ${contact.account.name}'s regional operations focus. Would you be open to a 15-min problem interview on resilient AI-enabled infrastructure nodes?`,
      Consultative: `Hi ${contact.name}, teams in ${contact.account.industry} are balancing reliability and automation. Could we share a short framework and get your view in a 15-min problem interview?`,
      Short: `Hi ${contact.name} — reason for reaching out: regional uptime pressure. Open to a quick 15-min problem interview next week?`
    },
    LinkedIn: {
      Direct: `Hi ${contact.name}, quick reason-now: regional ops reliability. Open to a 15-min problem interview on AI-enabled infrastructure nodes?`,
      Consultative: `Hi ${contact.name}, we’re learning how ops leaders handle resilience + AI in regional settings. Open to a 15-min problem interview?`,
      Short: `Reason now: regional reliability. 15-min interview?`
    },
    Call: {
      Direct: `Hi ${contact.name}, calling because regional reliability demands are rising.\nCould we book a 15-min problem interview?`,
      Consultative: `Hi ${contact.name}, we’re benchmarking infrastructure constraints in ${contact.account.industry}.\nOpen to a 15-min problem interview?`,
      Short: `Quick one: regional AI infrastructure constraints.\nCan we schedule 15 minutes?`
    }
  };

  const promptData = { account: contact.account, title: contact.title, disc: contact.discProfile?.hypothesisJson };
  const drafts = await generateJson([{ role: "system", content: "Create Email<=120 words, LinkedIn<=60 words, Call opener 2 lines. 3 tones each: Direct, Consultative, Short. One reason-now and one ask." }, { role: "user", content: JSON.stringify(promptData) }], fallback);

  await prisma.outreachDraft.deleteMany({ where: { contactId: contact.id } });
  for (const channel of ["Email", "LinkedIn", "Call"] as const) {
    for (const tone of ["Direct", "Consultative", "Short"] as const) {
      await prisma.outreachDraft.create({ data: { contactId: contact.id, channel, tone, draftText: drafts[channel][tone] } });
    }
  }

  return NextResponse.json({ ok: true, drafts });
}
