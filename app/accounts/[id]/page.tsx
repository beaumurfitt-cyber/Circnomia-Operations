import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AccountActions } from "@/components/account-actions";
import { AddContactForm } from "@/components/add-contact-form";

export default async function AccountDetail({ params }: { params: { id: string } }) {
  const account = await prisma.account.findUnique({ where: { id: params.id }, include: { contacts: true } });
  if (!account) return <div>Not found</div>;
  const enrichments = await prisma.enrichment.findMany({ where: { entityType: "Account", entityId: params.id } });
  const sources = await prisma.source.findMany({ where: { entityType: "Account", entityId: params.id } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{account.name}</h1>
      <div className="card">{account.industry} · {account.region} · Stage: {account.stage}</div>
      <AccountActions accountId={account.id} />
      <AddContactForm accountId={account.id} />
      <div className="card"><h3 className="font-semibold">Contacts</h3>{account.contacts.map(c => <div key={c.id}><Link className="underline" href={`/contacts/${c.id}`}>{c.name}</Link> — {c.title}</div>)}</div>
      <div className="card"><h3 className="font-semibold">Enrichment</h3>{enrichments.map(e => <pre key={e.id} className="text-xs">{e.field}: {e.valueJson}</pre>)}</div>
      <div className="card"><h3 className="font-semibold">Sources used</h3>{sources.map(s => <div key={s.id} className="text-sm"><a className="underline" href={s.url}>{s.url}</a> ({s.retrievedAt.toISOString()})</div>)}</div>
    </div>
  );
}
