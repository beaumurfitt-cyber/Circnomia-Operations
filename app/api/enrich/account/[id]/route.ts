import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractPage, simpleSearch } from "@/lib/enrichment";
import { generateJson } from "@/lib/llmClient";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const account = await prisma.account.findUnique({ where: { id: params.id } });
  if (!account) return NextResponse.json({ error: "not found" }, { status: 404 });

  const urlInputs: string[] = (body.urls ?? []).slice(0, 5);
  const searchUrls = body.useSearch ? await simpleSearch(`${account.name} ${account.industry} ${account.region}`) : [];
  const urls = [...new Set([...urlInputs, ...searchUrls])].slice(0, 5);

  const pages = await Promise.all(urls.map((url) => extractPage(url)));
  const sources = await Promise.all(pages.map((p) => prisma.source.create({ data: { entityType: "Account", entityId: account.id, url: p.url, title: p.title, snippet: p.snippet } })));

  const fallback = {
    company_summary: `${account.name} operates in ${account.industry}.`,
    operations_footprint: [account.region],
    initiatives: ["Operational efficiency"],
    why_now_triggers: ["Regional expansion"],
    likely_priorities: ["Resilience", "Automation"],
    suggested_entry_points: ["COO: discuss reliability KPIs"]
  };

  const enriched = await generateJson(
    [{ role: "system", content: "Return JSON with company_summary, operations_footprint, initiatives, why_now_triggers, likely_priorities, suggested_entry_points." }, { role: "user", content: pages.map((p) => `${p.url}\n${p.text.slice(0, 2000)}`).join("\n\n") }],
    fallback
  );

  await Promise.all(Object.entries(enriched).map(([field, value]) => prisma.enrichment.create({ data: { entityType: "Account", entityId: account.id, field, valueJson: JSON.stringify(value), confidence: 65, sourceIds: JSON.stringify(sources.map((s) => s.id)) } })));

  return NextResponse.json({ ok: true, enriched, sourceCount: sources.length });
}
