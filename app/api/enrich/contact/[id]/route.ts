import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractPage } from "@/lib/enrichment";
import { generateJson } from "@/lib/llmClient";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const contact = await prisma.contact.findUnique({ where: { id: params.id } });
  if (!contact) return NextResponse.json({ error: "not found" }, { status: 404 });
  const urls = (body.urls ?? []).slice(0, 5);
  const pages = await Promise.all(urls.map((url: string) => extractPage(url)));
  const sources = await Promise.all(pages.map((p) => prisma.source.create({ data: { entityType: "Contact", entityId: contact.id, url: p.url, title: p.title, snippet: p.snippet } })));

  const fallback = {
    bio_summary: `${contact.name} is ${contact.title}.`,
    likely_kpis: ["Uptime", "Cost control"],
    likely_objections: ["Budget and implementation risk"],
    preferred_comms_signals: ["Concise and practical"]
  };

  const enriched = await generateJson(
    [{ role: "system", content: "Professional signals only. Return JSON for bio_summary, likely_kpis, likely_objections, preferred_comms_signals." }, { role: "user", content: pages.map((p) => `${p.url}\n${p.text.slice(0, 2000)}`).join("\n\n") }],
    fallback
  );

  await Promise.all(Object.entries(enriched).map(([field, value]) => prisma.enrichment.create({ data: { entityType: "Contact", entityId: contact.id, field, valueJson: JSON.stringify(value), confidence: 60, sourceIds: JSON.stringify(sources.map((s) => s.id)) } })));
  return NextResponse.json({ ok: true, enriched });
}
