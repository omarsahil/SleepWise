import Link from "next/link";
import { useState } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

export default function ExportData() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);

  const handleExport = async () => {
    if (!user) return;
    const [logs, goals, journal] = await Promise.all([
      supabase.from("sleep_logs").select("*").eq("user_id", user.id),
      supabase.from("sleep_goals").select("*").eq("user_id", user.id),
      supabase.from("sleep_journal").select("*").eq("user_id", user.id),
    ]);
    setData({ logs: logs.data, goals: goals.data, journal: journal.data });
  };

  const download = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sleep_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <nav className="mb-4">
          <Link className="text-blue-600 hover:underline" href="/">
            Home
          </Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4 text-center">Export Data</h2>
        <SignedOut>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Load My Data
            </button>
            {data && (
              <button
                onClick={download}
                className="w-full bg-gray-700 text-white rounded px-4 py-2 hover:bg-gray-800"
              >
                Download JSON
              </button>
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
