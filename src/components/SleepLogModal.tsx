"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Factor {
  name: string;
  icon: React.ReactNode;
}

interface SleepLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: any) => void;
  availableFactors: Factor[];
}

const SleepLogModal: React.FC<SleepLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableFactors,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const toggleFactor = (factorName: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factorName)
        ? prev.filter((f) => f !== factorName)
        : [...prev, factorName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      date,
      bedtime,
      wakeTime,
      quality,
      notes,
      factors: selectedFactors,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl text-white"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Log Your Sleep</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bedtime"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Bedtime
                  </label>
                  <input
                    type="time"
                    id="bedtime"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wakeTime"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Wake-up Time
                  </label>
                  <input
                    type="time"
                    id="wakeTime"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sleep Quality
                </label>
                <div className="flex justify-around bg-gray-700 rounded-lg p-2">
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`p-2 rounded-md transition-all ${
                        quality === q
                          ? "bg-purple-600 scale-110"
                          : "hover:bg-gray-600"
                      }`}
                    >
                      {["😴", "😕", "😐", "😊", "🤩"][q - 1]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Factors
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFactors.map((factor) => (
                    <button
                      type="button"
                      key={factor.name}
                      onClick={() => toggleFactor(factor.name)}
                      className={`flex items-center gap-2 py-2 px-3 rounded-full text-sm transition-all ${
                        selectedFactors.includes(factor.name)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {factor.icon}
                      {factor.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="e.g., read a book, felt stressed..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Save Sleep
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SleepLogModal;
