"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddContactForm({ accountId }: { accountId: string }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Add Contact</h3>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={async () => {
          await fetch("/api/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId, name, title })
          });
          setName(""); setTitle(""); router.refresh();
        }}
      >Save Contact</button>
    </div>
  );
}
