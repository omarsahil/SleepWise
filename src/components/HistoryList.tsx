"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface Factor {
  name: string;
  icon: React.ReactNode;
}

interface SleepLog {
  id: number;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
  factors: string[];
}

interface HistoryListProps {
  sleepData: SleepLog[];
  availableFactors: Factor[];
  calculateDuration: (
    bedtime: string,
    wakeTime: string
  ) => { hours: number; minutes: number; totalMinutes: number };
  calculateSleepScore: (durationMinutes: number, quality: number) => number;
  onDelete?: (id: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  sleepData,
  availableFactors,
  calculateDuration,
  calculateSleepScore,
  onDelete,
}) => {
  const reversedData = useMemo(() => [...sleepData].reverse(), [sleepData]);

  const FactorIcon = ({ factorName }: { factorName: string }) => {
    const factor = availableFactors.find((f) => f.name === factorName);
    return factor ? <span title={factor.name}>{factor.icon}</span> : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white">Sleep History</h2>
      <div className="space-y-4">
        {reversedData.map((log) => {
          const duration = calculateDuration(log.bedtime, log.wakeTime);
          const score = calculateSleepScore(duration.totalMinutes, log.quality);
          return (
            <motion.div
              key={log.id}
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reversedData.indexOf(log) * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-bold text-lg">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="border-l border-gray-700 pl-4">
                  <p className="font-semibold text-white">
                    {duration.hours}h {duration.minutes}m of sleep
                  </p>
                  <p className="text-sm text-gray-400">
                    {log.bedtime} - {log.wakeTime}
                  </p>
                  {log.notes && (
                    <p className="text-sm text-gray-500 italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 mb-1">
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this log?"
                          )
                        ) {
                          onDelete(log.id);
                        }
                      }}
                      className="p-2 rounded-full bg-gradient-to-tr from-red-500 to-pink-500 hover:scale-110 hover:shadow-lg transition-transform duration-150 focus:outline-none"
                      title="Delete log"
                    >
                      <Trash2 size={18} className="text-white" />
                    </button>
                  )}
                  <p className="font-bold text-xl text-white mb-0">{score}</p>
                </div>
                <p className="text-xs text-gray-400">Score</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HistoryList;
