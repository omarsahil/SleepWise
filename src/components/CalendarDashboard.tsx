import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../utils/supabaseClient";

// Helper to get days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get first day of week (0=Sun, 1=Mon...)
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Helper to normalize event dates to 'YYYY-MM-DD' strings
const normalizeEvents = (events: any[]) =>
  (events || []).map((e) => ({
    ...e,
    date:
      typeof e.date === "string"
        ? e.date.slice(0, 10)
        : new Date(e.date).toISOString().slice(0, 10),
  }));

// Event type
interface CalendarEvent {
  id: string; // Added for Supabase
  date: string; // YYYY-MM-DD
  title: string;
  note?: string;
  color?: string;
}

const accent = "bg-purple-600";
const accentHover = "bg-purple-700";

const COLORS = [
  "bg-purple-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-yellow-400",
  "bg-blue-500",
  "bg-red-500",
];

export default function CalendarDashboard() {
  const { user } = useUser();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalData, setModalData] = useState({
    title: "",
    note: "",
    color: COLORS[0],
  });
  const [quickEvent, setQuickEvent] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch events for the current user and visible month
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      setLoading(true);
      const monthStart = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-01`;
      const monthEnd = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-31`;
      const { data, error } = await supabase
        .from("calendar_events")
        .select("id, date, title, note, color")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd)
        .order("date", { ascending: true });
      if (!error) setEvents(normalizeEvents(data));
      setLoading(false);
    };
    fetchEvents();
  }, [user, currentMonth, currentYear]);

  // Days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  // Build calendar grid
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  // Events for selected day
  const selectedEvents = events.filter((e) => e.date === selectedDate);

  // Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const handleDayClick = (d: number | null) => {
    if (!d) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };
  const handleAddEvent = async () => {
    if (!modalData.title.trim() || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: user.id,
        date: selectedDate,
        title: modalData.title,
        note: modalData.note,
        color: modalData.color,
      })
      .select();
    if (error) {
      console.error("Supabase insert error (modal):", error);
    }
    if (!error && data) setEvents([...events, ...normalizeEvents(data)]);
    setShowModal(false);
    setModalData({ title: "", note: "", color: COLORS[0] });
    setLoading(false);
  };

  // Delete event handler
  const handleDeleteEvent = async (idx: number) => {
    const eventToDelete = selectedEvents[idx];
    if (!eventToDelete) return;
    setLoading(true);
    await supabase.from("calendar_events").delete().eq("id", eventToDelete.id);
    setEvents(events.filter((e) => e.id !== eventToDelete.id));
    setLoading(false);
  };

  // Quick add event handler
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEvent.trim() || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: user.id,
        date: selectedDate,
        title: quickEvent,
        note: quickNote,
        color: COLORS[0],
      })
      .select();
    if (error) {
      console.error("Supabase insert error (quick add):", error);
    }
    if (!error && data) setEvents([...events, ...normalizeEvents(data)]);
    setQuickEvent("");
    setQuickNote("");
    setLoading(false);
  };

  // Helper: does a day have events?
  const hasEvent = (d: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    return events.some((e) => e.date === dateStr);
  };

  // Helper: is today
  const isToday = (d: number) => {
    return (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Helper: is selected
  const isSelected = (d: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    return selectedDate === dateStr;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-md mx-auto mt-8"
    >
      <div className="bg-white/5 rounded-2xl shadow-xl p-6">
        {/* Month/Year header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &#8592;
          </button>
          <div className="text-lg font-bold text-white">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            onClick={handleNextMonth}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &#8594;
          </button>
        </div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              whileHover={d ? { scale: 1.08 } : {}}
              className={`aspect-square w-8 rounded-lg flex flex-col items-center justify-center transition-all
                ${d && isToday(d) ? "border-2 border-purple-400" : ""}
                ${
                  d && isSelected(d)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-purple-700"
                }
                ${!d ? "opacity-0 cursor-default" : ""}`}
              onClick={() => handleDayClick(d)}
              disabled={!d}
              layoutId={d && isSelected(d) ? "selected-day" : undefined}
            >
              <span className="font-semibold">{d || ""}</span>
              {/* Event dot */}
              {d && hasEvent(d) && (
                <span className="w-2 h-2 mt-1 rounded-full bg-purple-400"></span>
              )}
            </motion.button>
          ))}
        </div>
        {/* Events for selected day */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="text-white font-bold mb-2">Events</div>
          {/* Inline quick add event with note */}
          <form
            onSubmit={handleQuickAdd}
            className="flex flex-col gap-2 mb-3 w-full"
          >
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Add event title..."
              value={quickEvent}
              onChange={(e) => setQuickEvent(e.target.value)}
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Add note (optional)..."
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
            />
            <button
              type="submit"
              className="self-end px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm"
              disabled={!quickEvent.trim() || loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
          {selectedEvents.length === 0 ? (
            <div className="text-gray-400 text-sm">No events for this day.</div>
          ) : (
            <ul className="space-y-2">
              {selectedEvents.map((e, idx) => (
                <li
                  key={e.id}
                  className="bg-gray-900 rounded-lg p-3 flex items-center gap-3"
                >
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Delete event"
                    onClick={() => handleDeleteEvent(idx)}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                  </button>
                  <span className={`w-3 h-3 rounded-full ${e.color}`}></span>
                  <div>
                    <div className="text-white font-semibold">{e.title}</div>
                    {e.note && (
                      <div className="text-gray-400 text-xs">{e.note}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
        {/* Floating Add Button */}
        <motion.button
          className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg z-50"
          onClick={() => setShowModal(true)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          disabled={loading}
        >
          +
        </motion.button>
        {/* Add Event Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-white relative"
              >
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <div className="mb-4 text-lg font-bold">Add Event</div>
                <input
                  className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Title"
                  value={modalData.title}
                  onChange={(e) =>
                    setModalData({ ...modalData, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Note (optional)"
                  value={modalData.note}
                  onChange={(e) =>
                    setModalData({ ...modalData, note: e.target.value })
                  }
                />
                <div className="mb-3 flex gap-2 items-center">
                  <span className="text-gray-400 text-sm">Label:</span>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`w-5 h-5 rounded-full border-2 ${
                        modalData.color === c
                          ? "border-white"
                          : "border-gray-700"
                      } ${c}`}
                      onClick={() => setModalData({ ...modalData, color: c })}
                    />
                  ))}
                </div>
                <button
                  className="w-full py-2 mt-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
                  onClick={handleAddEvent}
                  disabled={!modalData.title.trim() || loading}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
