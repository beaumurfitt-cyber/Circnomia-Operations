import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { discSchema, normalizeDisc } from "@/lib/disc";
import { generateJson } from "@/lib/llmClient";

export async function POST(_: Request, { params }: { params: { contactId: string } }) {
  const contact = await prisma.contact.findUnique({ where: { id: params.contactId } });
  if (!contact) return NextResponse.json({ error: "not found" }, { status: 404 });
  const sources = await prisma.source.findMany({ where: { entityType: "Contact", entityId: contact.id } });

  const fallback = {
    type: "Unknown",
    confidence: 30,
    evidence: sources.slice(0, 2).map((s) => ({ claim: "Professional writing style observed", source_url: s.url })),
    recommended_playbook: {
      tone: "Neutral and concise",
      meeting_structure: ["Context", "Current state", "Constraint", "Next step"],
      do: ["Use role-relevant metrics"],
      dont: ["Avoid personal assumptions"],
      objection_style: ["Acknowledge constraints and propose pilot"]
    },
    disclaimer: "Communication-style hypothesis only. Uses professional signals only."
  };

  const raw = await generateJson(
    [{ role: "system", content: "Generate DISC communication-style hypothesis from professional signals only. If evidence <2, return Unknown confidence <=40." }, { role: "user", content: JSON.stringify({ name: contact.name, title: contact.title, sources }) }],
    fallback
  );
  const parsed = normalizeDisc(discSchema.parse(raw));

  await prisma.discProfile.upsert({
    where: { contactId: contact.id },
    update: { hypothesisJson: JSON.stringify(parsed) },
    create: { contactId: contact.id, hypothesisJson: JSON.stringify(parsed) }
  });

  return NextResponse.json(parsed);
}
