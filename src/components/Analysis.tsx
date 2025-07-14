"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
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

  // --- Sleep Debt Calculation ---
  // Use the user's sleep goal from the most recent settings (default 8 if not available)
  const sleepGoal =
    analysisData.length > 0
      ? analysisData[analysisData.length - 1].goal || 8
      : 8;
  // Calculate sleep debt for the last 7 days
  const sleepDebt = analysisData.slice(-7).reduce((acc, curr) => {
    const debt = sleepGoal - curr.duration;
    return acc + (debt > 0 ? debt : 0);
  }, 0);
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
          <p>
            • Your total sleep debt over the last 7 days is{" "}
            <span className="font-bold text-red-400">
              {sleepDebt.toFixed(1)} hours
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

      {/* Sleep Debt Calculator Section */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl mt-8">
        <h3 className="text-xl font-bold text-white mb-4">
          Quick Sleep Debt Calculator
        </h3>
        <SleepDebtCalculator />
      </div>
    </motion.div>
  );
};

// --- SleepDebtCalculator Component ---
const SleepDebtCalculator = () => {
  const [actual, setActual] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [result, setResult] = useState<null | number>(null);
  const [animatedFill, setAnimatedFill] = useState(0);
  const wavePhaseRef = useRef(0);
  const [renderWavePhase, setRenderWavePhase] = useState(0); // for re-render
  const requestRef = useRef<number | null>(null);
  const fillAnimRef = useRef<number | null>(null);
  const [selectedQuote, setSelectedQuote] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (actual === "" || goal === "" || goal === "0") return;
    setResult(Number(goal) - Number(actual));
    setAnimatedFill(0); // reset fill animation
    // Calculate quote
    const actualNumCalc = Number(actual);
    const goalNumCalc = Number(goal);
    const diff = actualNumCalc - goalNumCalc;
    let newQuote = "";
    if (Math.abs(diff) <= 0.25) {
      newQuote = getRandomQuote(quotes.onTarget);
    } else if (diff < -1) {
      newQuote = getRandomQuote(quotes.needMore);
    } else if (diff < -0.25) {
      newQuote = getRandomQuote(quotes.almostThere);
    } else if (diff > 1) {
      newQuote = getRandomQuote(quotes.overslept);
    } else if (diff > 0.25) {
      newQuote = getRandomQuote(quotes.slightlyOver);
    }
    setSelectedQuote(newQuote);
  };

  const actualNum = actual === "" ? 0 : Number(actual);
  const goalNum = goal === "" ? 0 : Number(goal);

  // Quote options for each scenario
  const quotes = {
    onTarget: [
      "You’re right on target, great job!",
      "Perfect! Your sleep routine is on point.",
      "Spot on! Keep up the healthy sleep habits.",
    ],
    almostThere: [
      "Almost there! Try to get just a bit more sleep.",
      "So close! A little more rest will do wonders.",
      "Nearly at your goal—keep pushing for those extra minutes.",
    ],
    needMore: [
      "You need more sleep, try to rest up tonight!",
      "Consider winding down earlier for better rest.",
      "Your body needs more recovery—aim for your goal tomorrow.",
    ],
    slightlyOver: [
      "Slightly over your goal. Consistency is key!",
      "A bit too much sleep—try to keep a steady schedule.",
      "You’re getting plenty of rest! Just keep it balanced.",
    ],
    overslept: [
      "You overslept, try to keep a consistent schedule!",
      "Too much sleep can disrupt your rhythm—aim for your goal.",
      "Oversleeping? Try to wake up at the same time each day.",
    ],
  };

  function getRandomQuote(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let message = "";
  if (result !== null) {
    const diff = actualNum - goalNum;
    if (Math.abs(diff) <= 0.25) {
      message = "You are meeting your sleep goal!";
    } else if (diff < -1) {
      message = `You need to sleep ${Math.abs(diff).toFixed(
        1
      )} more hours to meet your goal.`;
    } else if (diff < -0.25) {
      message = `Almost there! Just ${Math.abs(diff).toFixed(
        1
      )} more hours to your goal.`;
    } else if (diff > 1) {
      message = `You are over your goal by ${diff.toFixed(1)} hours.`;
    } else if (diff > 0.25) {
      message = `Slightly over your goal by ${diff.toFixed(1)} hours.`;
    }
  }

  // Liquid gauge (wave) visualization
  const percent = goalNum > 0 ? Math.min((actualNum / goalNum) * 100, 100) : 0;
  const radius = 72; // larger
  const waveHeight = 18; // increased amplitude
  const waveCount = 3; // increased frequency
  const width = radius * 2;
  const height = radius * 2 + 24; // taller
  const centerY = height / 2;
  // Calculate fill level: if 100%, fill to the top
  const fillLevel =
    animatedFill === 100 ? 0 : height - (animatedFill / 100) * height;

  // Animate wave phase (horizontal movement) without causing React re-renders
  useEffect(() => {
    let running = true;
    const animate = () => {
      wavePhaseRef.current += 0.08;
      setRenderWavePhase(wavePhaseRef.current); // only for re-render
      if (running) requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Animate fill level (vertical rise)
  useEffect(() => {
    if (result === null) return;
    let start = animatedFill;
    let end = percent;
    let startTime: number | null = null;
    const duration = 900; // ms
    const animateFill = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedFill(start + (end - start) * progress);
      if (progress < 1) {
        fillAnimRef.current = requestAnimationFrame(animateFill);
      } else {
        setAnimatedFill(end);
      }
    };
    fillAnimRef.current = requestAnimationFrame(animateFill);
    return () => {
      if (fillAnimRef.current) cancelAnimationFrame(fillAnimRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, percent]);

  // Generate wave path (with phase and optional offset)
  function getWavePath(
    phase: number,
    offset: number = 0,
    amp: number = waveHeight
  ) {
    let path = `M 0 ${fillLevel}`;
    for (let x = 0; x <= width; x++) {
      const y =
        amp * Math.sin(2 * Math.PI * waveCount * (x / width) + phase + offset) +
        fillLevel;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  }

  return (
    <form onSubmit={handleCalculate} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-gray-300">
            How many hours did you sleep?
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-3 py-2"
            required
            placeholder="e.g. 7.5"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-300">
            What is your sleep goal (hours)?
          </label>
          <input
            type="number"
            min="1"
            max="24"
            step="0.1"
            value={goal}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, "");
              if (val === "0") val = "";
              else if (val.length > 1) val = val.replace(/^0+/, "");
              if (val !== "" && Number(val) > 24) val = "24";
              setGoal(val);
            }}
            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-3 py-2"
            required
            placeholder="e.g. 8"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
        disabled={actual === "" || goal === "" || goal === "0"}
      >
        Calculate Sleep Debt
      </button>
      {result !== null && (
        <div className="mt-4 space-y-2 flex flex-col items-center">
          <div className="text-lg font-semibold text-white">{message}</div>
          {actual !== "" && goal !== "" && goal !== "0" && (
            <div className="relative my-2" style={{ width, height }}>
              <svg width={width} height={height} style={{ display: "block" }}>
                <defs>
                  <clipPath id="liquidClip">
                    <circle cx={radius} cy={height / 2} r={radius - 2} />
                  </clipPath>
                  <linearGradient
                    id="liquidGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                {/* Circle border */}
                <circle
                  cx={radius}
                  cy={height / 2}
                  r={radius - 2}
                  fill="#181c2a"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 8px #a78bfa55)"
                />
                {/* Animated wave fill */}
                <g clipPath="url(#liquidClip)">
                  {/* Main wave */}
                  <path
                    d={getWavePath(wavePhaseRef.current)}
                    fill="url(#liquidGradient)"
                    // No transition for smooth animation
                  />
                  {/* Second wave for more liquid effect */}
                  <path
                    d={getWavePath(
                      wavePhaseRef.current,
                      Math.PI,
                      waveHeight * 0.7
                    )}
                    fill="#a78bfa"
                    opacity="0.35"
                    // No transition for smooth animation
                  />
                </g>
                {/* Percent label */}
                <text
                  x="50%"
                  y={height / 2 - 8}
                  textAnchor="middle"
                  fontSize="1.5rem"
                  fill="#fff"
                  fontWeight="bold"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {Math.round(percent)}%
                </text>
                {/* Actual/Goal label */}
                <text
                  x="50%"
                  y={height / 2 + 22}
                  textAnchor="middle"
                  fontSize="1.1rem"
                  fill="#c7d2fe"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {actual}h / {goal}h
                </text>
              </svg>
            </div>
          )}
          <div className="text-purple-300 text-base text-center mt-2">
            {selectedQuote}
          </div>
        </div>
      )}
    </form>
  );
};

export default Analysis;
