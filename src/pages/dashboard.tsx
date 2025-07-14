"use client";
// Dashboard page using modern UI with recharts and lucide-react
import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";
import {
  Bed,
  BarChart2,
  History as HistoryIcon,
  Settings,
  Coffee,
  Dumbbell,
  BookOpen,
  BrainCircuit,
  Zap,
  Moon,
  Calendar,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import HomeDashboard from "../components/HomeDashboard";
import Analysis from "../components/Analysis";
import HistoryList from "../components/HistoryList";
import SettingsPanel from "../components/SettingsPanel";
import NavBar from "../components/NavBar";
import SleepLogModal from "../components/SleepLogModal";
import CalendarDashboard from "../components/CalendarDashboard";

// --- Factor List ---
const availableFactors = [
  { name: "Caffeine", icon: <Coffee size={18} /> },
  { name: "Exercise", icon: <Dumbbell size={18} /> },
  { name: "Stress", icon: <BrainCircuit size={18} /> },
  { name: "Read book", icon: <BookOpen size={18} /> },
  { name: "Screen time", icon: <Zap size={18} /> },
  { name: "Ate late", icon: <Moon size={18} /> },
  { name: "Meditation", icon: <Zap size={18} /> },
];

// --- Helper Functions ---
const calculateDuration = (bedtime: string, wakeTime: string) => {
  const start = new Date(`2000-01-01T${bedtime}`);
  let end = new Date(`2000-01-01T${wakeTime}`);
  if (end < start) end.setDate(end.getDate() + 1);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return { hours, minutes, totalMinutes: hours * 60 + minutes };
};
const calculateSleepScore = (durationMinutes: number, quality: number) => {
  const durationScore = Math.min(durationMinutes / (8 * 60), 1) * 60;
  const qualityScore = (quality / 5) * 40;
  return Math.round(durationScore + qualityScore);
};

// --- Main Dashboard Page ---
const navItems = [
  { page: "home", icon: <Bed size={24} />, label: "Home" },
  { page: "calendar", icon: <Calendar size={24} />, label: "Calendar" },
  { page: "analysis", icon: <BarChart2 size={24} />, label: "Analysis" },
  { page: "history", icon: <HistoryIcon size={24} />, label: "History" },
  { page: "settings", icon: <Settings size={24} />, label: "Settings" },
];

type SleepLog = {
  id: number;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
  factors: string[];
};

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [activePage, setActivePage] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sleepData, setSleepData] = useState<SleepLog[]>([]);
  const [settings, setSettings] = useState({ sleepGoal: 8, theme: "dark" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Fetch sleep logs from Supabase
  const fetchSleepLogs = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .limit(30); // Fetch only the last 30 logs
    if (error) {
      setError("Failed to load sleep logs.");
      setSleepData([]);
    } else {
      // Map snake_case to camelCase for local use
      setSleepData(
        (data || []).map((log: any) => ({
          id: log.id,
          date: log.date,
          bedtime: log.bedtime,
          wakeTime: log.wake_time,
          quality: log.quality,
          notes: log.notes,
          // Always ensure factors is an array
          factors: Array.isArray(log.factors)
            ? log.factors
            : typeof log.factors === "string" && log.factors.length > 0
            ? JSON.parse(log.factors)
            : [],
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    setIsClient(true);
    if (user) fetchSleepLogs();
  }, [user]);

  // Save new log to Supabase
  const handleSaveSleep = async (newLog: any) => {
    if (!user) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.from("sleep_logs").insert({
      user_id: user.id,
      date: newLog.date,
      bedtime: newLog.bedtime,
      wake_time: newLog.wakeTime,
      quality: newLog.quality,
      notes: newLog.notes,
      // factors: JSON.stringify(newLog.factors), // REMOVED
    });
    if (error) {
      console.error("Supabase insert error:", error); // <-- Add this line
      setError("Failed to save log.");
    } else {
      await fetchSleepLogs();
    }
    setLoading(false);
  };

  // Delete log handler
  const handleDeleteLog = async (id: number) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.from("sleep_logs").delete().eq("id", id);
    if (error) {
      setError("Failed to delete log.");
    } else {
      setSleepData((prev) => prev.filter((log) => log.id !== id));
    }
    setLoading(false);
  };

  if (!isClient || !isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col md:flex-row">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-black z-0"></div>
      <NavBar
        activePage={activePage}
        setActivePage={setActivePage}
        navItems={navItems}
        onLogClick={() => setIsModalOpen(true)}
      />
      {/* Main content area - improved for mobile */}
      <main className="flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 pb-20 md:pb-8 relative z-10 overflow-y-auto max-w-full w-full mx-auto">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="loading"
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-lg text-gray-400 animate-pulse">
                Loading sleep data...
              </span>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-lg text-red-400">{error}</span>
            </motion.div>
          ) : (
            <>
              {activePage === "home" && (
                <HomeDashboard
                  sleepData={sleepData}
                  settings={settings}
                  onLogSleepClick={() => setIsModalOpen(true)}
                  calculateDuration={calculateDuration}
                  calculateSleepScore={calculateSleepScore}
                />
              )}
              {activePage === "calendar" && <CalendarDashboard />}
              {activePage === "analysis" && (
                <Analysis
                  sleepData={sleepData}
                  availableFactors={availableFactors}
                  calculateDuration={calculateDuration}
                  calculateSleepScore={calculateSleepScore}
                />
              )}
              {activePage === "history" && (
                <HistoryList
                  sleepData={sleepData}
                  availableFactors={availableFactors}
                  calculateDuration={calculateDuration}
                  calculateSleepScore={calculateSleepScore}
                  onDelete={handleDeleteLog}
                />
              )}
              {activePage === "settings" && (
                <SettingsPanel
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              )}
            </>
          )}
        </AnimatePresence>
        <SleepLogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSleep}
          availableFactors={availableFactors}
        />
      </main>
    </div>
  );
}
