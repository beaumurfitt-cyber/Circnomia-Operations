"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccountActions({ accountId }: { accountId: string }) {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const run = async (path: string, body: unknown = {}) => {
    setLoading(path);
    await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="card space-y-2">
      <textarea placeholder="Up to 5 URLs, one per line" value={urls} onChange={(e) => setUrls(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={() => run(`/api/enrich/account/${accountId}`, { urls: urls.split('\n').filter(Boolean) })}>
          {loading?.includes("/enrich/") ? "Enriching..." : "Enrich Account"}
        </button>
        <button onClick={() => run("/api/score/recompute", { accountId })}>Generate Next Actions</button>
      </div>
    </div>
  );
}
