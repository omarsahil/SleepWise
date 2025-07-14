"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { PlusCircle, Sun, Moon, Bed, Clock } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";

interface SleepLog {
  id: number;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
  factors: string[];
}

interface HomeDashboardProps {
  sleepData: SleepLog[];
  settings: { sleepGoal: number; theme: string };
  onLogSleepClick: () => void;
  calculateDuration: (
    bedtime: string,
    wakeTime: string
  ) => { hours: number; minutes: number; totalMinutes: number };
  calculateSleepScore: (durationMinutes: number, quality: number) => number;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  sleepData,
  settings,
  onLogSleepClick,
  calculateDuration,
  calculateSleepScore,
}) => {
  const lastNight =
    sleepData.length > 0 ? sleepData[sleepData.length - 1] : null;
  const duration = lastNight
    ? calculateDuration(lastNight.bedtime, lastNight.wakeTime)
    : { hours: 0, minutes: 0, totalMinutes: 0 };
  const sleepScore = lastNight
    ? calculateSleepScore(duration.totalMinutes, lastNight.quality)
    : 0;
  const scoreData = [{ name: "score", value: sleepScore, fill: "#805AD5" }];

  const recentData = sleepData.slice(-7).map((d) => {
    const dur = calculateDuration(d.bedtime, d.wakeTime);
    return {
      name: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
      duration: dur.totalMinutes / 60,
      goal: settings.sleepGoal,
    };
  });

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div
        className="text-center"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Sleep Dashboard
        </h1>
        <p className="text-gray-300 mt-2">Your nightly summary and trends.</p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            Last 7 Days Overview
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={recentData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" tick={{ fill: "#A0AEC0" }} />
                <YAxis unit="h" tick={{ fill: "#A0AEC0" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A202C",
                    border: "1px solid #4A5568",
                  }}
                  cursor={{ fill: "rgba(128, 90, 213, 0.2)" }}
                />
                <Legend />
                <Bar
                  dataKey="duration"
                  name="Sleep Duration"
                  fill="#805AD5"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  name="Sleep Goal"
                  stroke="#F6E05E"
                  strokeWidth={2}
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Last Night's Score
          </h3>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="90%"
                data={scoreData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar background dataKey="value" cornerRadius={10} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-4xl font-bold"
                >
                  {sleepScore}
                </text>
                <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-400 text-sm"
                >
                  out of 100
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-lg text-white">
            {duration.hours}h {duration.minutes}m
          </p>
          <p className="text-gray-400">
            Quality:{" "}
            {lastNight
              ? ["😴", "😕", "😐", "😊", "🤩"][lastNight.quality - 1]
              : "N/A"}
          </p>
        </div>
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <button
          onClick={onLogSleepClick}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Log New Sleep</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HomeDashboard;
