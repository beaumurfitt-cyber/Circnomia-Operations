import { prisma } from "@/lib/prisma";
import { ContactActions } from "@/components/contact-actions";

export default async function ContactPage({ params }: { params: { id: string } }) {
  const contact = await prisma.contact.findUnique({ where: { id: params.id }, include: { account: true, discProfile: true, outreachDrafts: true } });
  if (!contact) return <div>Not found</div>;
  const enrichments = await prisma.enrichment.findMany({ where: { entityType: "Contact", entityId: params.id } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{contact.name}</h1>
      <div className="card">{contact.title} @ {contact.account.name}</div>
      <ContactActions contactId={contact.id} />
      <div className="card">
        <h3 className="font-semibold">DISC Hypothesis</h3>
        <p className="text-sm">Communication-style hypothesis only. Not a personal trait inference.</p>
        <pre className="text-xs whitespace-pre-wrap">{contact.discProfile?.hypothesisJson ?? "Not enough data"}</pre>
      </div>
      <div className="card"><h3 className="font-semibold">Contact Enrichment</h3>{enrichments.map(e => <pre key={e.id} className="text-xs">{e.field}: {e.valueJson}</pre>)}</div>
      <div className="card"><h3 className="font-semibold">Outreach Drafts</h3>{contact.outreachDrafts.map(d => <pre key={d.id} className="text-xs">[{d.channel}/{d.tone}] {d.draftText}</pre>)}</div>
    </div>
  );
}
