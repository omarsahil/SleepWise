import Link from "next/link";
import { useState } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

export default function LogSleep() {
  const { user } = useUser();
  const [bedtime, setBedtime] = useState("");
  const [wake_time, setWake_time] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("sleep_logs").insert({
      user_id: user.id,
      bedtime,
      wake_time,
      date: new Date().toISOString().slice(0, 10),
    });
    setStatus(error ? "Error saving log." : "Log saved!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <nav className="mb-4">
          <Link className="text-blue-600 hover:underline" href="/">
            Home
          </Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4 text-center">Log Sleep</h2>
        <SignedOut>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Bedtime:</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Wake-up Time:</label>
              <input
                type="time"
                value={wake_time}
                onChange={(e) => setWake_time(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Save
            </button>
          </form>
          <div className="mt-2 text-center text-sm text-gray-600">{status}</div>
        </SignedIn>
      </div>
    </div>
  );
}
