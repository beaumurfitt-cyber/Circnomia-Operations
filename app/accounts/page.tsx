import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddAccountForm } from "@/components/add-account-form";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Circnomia Sales Agent (MVP)</h1>
      <AddAccountForm />
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Name</th><th>Industry</th><th>Region</th><th>Priority</th><th>Next Action</th><th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="border-b">
                <td><Link className="underline" href={`/accounts/${a.id}`}>{a.name}</Link></td>
                <td>{a.industry}</td>
                <td>{a.region}</td>
                <td>{a.priorityScore}</td>
                <td>{a.nextAction}</td>
                <td>{a.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
