"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContactActions({ contactId }: { contactId: string }) {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function run(path: string, body: unknown = {}) {
    setLoading(path);
    await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="card space-y-2">
      <textarea placeholder="Source URLs" value={urls} onChange={(e) => setUrls(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={() => run(`/api/enrich/contact/${contactId}`, { urls: urls.split('\n').filter(Boolean) })}>{loading?.includes("enrich") ? "Enriching..." : "Enrich Contact"}</button>
        <button onClick={() => run(`/api/disc/${contactId}`)}>DISC Hypothesis</button>
        <button onClick={() => run(`/api/outreach/${contactId}`)}>Generate Outreach Drafts</button>
      </div>
    </div>
  );
}
