"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

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

interface AnalysisProps {
  sleepData: SleepLog[];
  availableFactors: Factor[];
  calculateDuration: (
    bedtime: string,
    wakeTime: string
  ) => { hours: number; minutes: number; totalMinutes: number };
  calculateSleepScore: (durationMinutes: number, quality: number) => number;
}

const Analysis: React.FC<AnalysisProps> = ({
  sleepData,
  availableFactors,
  calculateDuration,
  calculateSleepScore,
}) => {
  const analysisData = useMemo(() => {
    return sleepData.map((d) => {
      const duration = calculateDuration(d.bedtime, d.wakeTime);
      const bedtimeMinutes =
        new Date(`2000-01-01T${d.bedtime}`).getHours() * 60 +
        new Date(`2000-01-01T${d.bedtime}`).getMinutes();
      const wakeTimeMinutes =
        new Date(`2000-01-01T${d.wakeTime}`).getHours() * 60 +
        new Date(`2000-01-01T${d.wakeTime}`).getMinutes();
      return {
        ...d,
        duration: duration.totalMinutes / 60,
        sleepScore: calculateSleepScore(duration.totalMinutes, d.quality),
        bedtimeDecimal:
          bedtimeMinutes < 720 ? bedtimeMinutes + 1440 : bedtimeMinutes,
        wakeTimeDecimal: wakeTimeMinutes,
        dateShort: new Date(d.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [sleepData, calculateDuration, calculateSleepScore]);

  const factorImpactData = useMemo(() => {
    const factorStats: Record<string, { totalScore: number; count: number }> =
      {};
    analysisData.forEach((log) => {
      log.factors.forEach((factor) => {
        if (!factorStats[factor]) {
          factorStats[factor] = { totalScore: 0, count: 0 };
        }
        factorStats[factor].totalScore += log.sleepScore;
        factorStats[factor].count++;
      });
    });
    return Object.entries(factorStats).map(([name, { totalScore, count }]) => ({
      name,
      avgScore: Math.round(totalScore / count),
    }));
  }, [analysisData]);

  const avgDuration =
    analysisData.length > 0
      ? analysisData.reduce((acc, curr) => acc + curr.duration, 0) /
        analysisData.length
      : 0;
  const bestFactor =
    factorImpactData.length > 0
      ? factorImpactData.reduce((max, f) =>
          f.avgScore > max.avgScore ? f : max
        )
      : null;
  const worstFactor =
    factorImpactData.length > 0
      ? factorImpactData.reduce((min, f) =>
          f.avgScore < min.avgScore ? f : min
        )
      : null;

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
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Sleep Analysis</h2>
      </motion.div>
      <motion.div
        className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="text-yellow-400" />
          Personalized Insights
        </h3>
        <div className="space-y-2 text-gray-300">
          <p>
            • Your average sleep duration is{" "}
            <span className="font-bold text-white">
              {avgDuration.toFixed(1)} hours
            </span>
            .
          </p>
          {bestFactor && (
            <p>
              • You seem to get the best sleep on days you{" "}
              <span className="font-bold text-green-400">
                {bestFactor.name.toLowerCase()}
              </span>
              , with an average score of{" "}
              <span className="font-bold text-white">
                {bestFactor.avgScore}
              </span>
              .
            </p>
          )}
          {worstFactor && (
            <p>
              •{" "}
              <span className="font-bold text-red-400">{worstFactor.name}</span>{" "}
              seems to negatively impact your sleep the most, with an average
              score of{" "}
              <span className="font-bold text-white">
                {worstFactor.avgScore}
              </span>
              .
            </p>
          )}
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            Factor Impact on Sleep Score
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={factorImpactData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#A0AEC0" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fill: "#A0AEC0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A202C",
                    border: "1px solid #4A5568",
                  }}
                />
                <Bar
                  dataKey="avgScore"
                  name="Average Score"
                  fill="#805AD5"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">
            Bedtime & Wake-up Trends
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={analysisData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="dateShort" tick={{ fill: "#A0AEC0" }} />
                <YAxis
                  tickFormatter={(v) =>
                    `${Math.floor((Number(v) / 60) % 24)}:${(Number(v) % 60)
                      .toString()
                      .padStart(2, "0")}`
                  }
                  domain={["dataMin - 60", "dataMax + 60"]}
                  tick={{ fill: "#A0AEC0" }}
                />
                <Tooltip
                  formatter={(v) =>
                    `${Math.floor((Number(v) / 60) % 24)}:${(Number(v) % 60)
                      .toString()
                      .padStart(2, "0")}`
                  }
                  contentStyle={{
                    backgroundColor: "#1A202C",
                    border: "1px solid #4A5568",
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="bedtimeDecimal"
                  name="Bedtime"
                  stroke="#9F7AEA"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="wakeTimeDecimal"
                  name="Wake-up"
                  stroke="#F6E05E"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analysis;
