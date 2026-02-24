import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <header className="flex gap-4 text-sm">
            <Link href="/accounts">Accounts</Link>
            <Link href="/settings">Settings</Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
