import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeNextAction, computePriority } from "@/lib/score";

export async function POST(req: Request) {
  const body = await req.json();
  const accounts = body.accountId ? await prisma.account.findMany({ where: { id: body.accountId } }) : await prisma.account.findMany();

  for (const account of accounts) {
    const [enrichments, contacts] = await Promise.all([
      prisma.enrichment.findMany({ where: { entityType: "Account", entityId: account.id } }),
      prisma.contact.findMany({ where: { accountId: account.id } })
    ]);
    const outreachCount = await prisma.outreachDraft.count({ where: { contactId: { in: contacts.map((c) => c.id) } } });
    const score = computePriority(account, enrichments, contacts);
    const hasExec = contacts.some((c) => /(COO|GM Ops|CIO|Head of Innovation)/i.test(c.title));

    await prisma.account.update({
      where: { id: account.id },
      data: {
        priorityScore: score.score,
        nextAction: computeNextAction({ hasEnrichment: enrichments.length > 0, hasExecContact: hasExec, hasOutreach: outreachCount > 0 })
      }
    });
  }

  return NextResponse.json({ ok: true });
}
