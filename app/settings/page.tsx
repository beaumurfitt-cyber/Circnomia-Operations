export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="card space-y-2">
        <p>Set LLM credentials in env vars:</p>
        <ul className="list-disc ml-5 text-sm">
          <li>LLM_API_KEY</li>
          <li>LLM_BASE_URL</li>
          <li>LLM_MODEL</li>
        </ul>
      </div>
      <div className="card space-y-2">
        <h3 className="font-semibold">Default Outreach Signature</h3>
        <input placeholder="Name" />
        <input placeholder="Company" />
        <input placeholder="Phone" />
      </div>
    </div>
  );
}
