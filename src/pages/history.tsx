import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

export default function SleepHistory() {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .then(({ data }) => setLogs(data || []));
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <nav className="mb-4">
          <Link className="text-blue-600 hover:underline" href="/">
            Home
          </Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Sleep History
        </h2>
        <SignedOut>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <ul className="divide-y divide-gray-200">
            {logs.length === 0 && (
              <li className="py-2 text-center text-gray-500">No logs found.</li>
            )}
            {logs.map((log, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{log.date}</span>
                <span>
                  {log.bedtime} - {log.wake_time}
                </span>
              </li>
            ))}
          </ul>
        </SignedIn>
      </div>
    </div>
  );
}
