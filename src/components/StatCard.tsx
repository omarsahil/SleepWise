"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  color: string;
  children?: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  unit,
  color,
  children,
}) => (
  <motion.div
    className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex flex-col justify-between"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">
          {value}{" "}
          <span className="text-base font-normal text-gray-300">{unit}</span>
        </p>
      </div>
    </div>
    {children}
  </motion.div>
);

export default StatCard;
