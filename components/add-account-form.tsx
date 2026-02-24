"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddAccountForm() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Mining");
  const [region, setRegion] = useState("AU-Regional");
  const [website, setWebsite] = useState("");
  const router = useRouter();

  const submit = async () => {
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, industry, region, website })
    });
    setName("");
    router.refresh();
  };

  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Add Account</h3>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      <input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      <input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
      <button onClick={submit}>Save</button>
    </div>
  );
}
