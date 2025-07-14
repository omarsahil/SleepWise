import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

export default function SleepGoal() {
  const { user } = useUser();
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("sleep_goals")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setGoal(data?.goal_hours || ""));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("sleep_goals").upsert({
      user_id: user.id,
      goal_hours: goal,
    });
    setStatus(error ? "Error saving goal." : "Goal saved!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <nav className="mb-4">
          <Link className="text-blue-600 hover:underline" href="/">
            Home
          </Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4 text-center">Sleep Goal</h2>
        <SignedOut>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Goal (hours):</label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                min="1"
                max="24"
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
