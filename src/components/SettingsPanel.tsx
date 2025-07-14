"use client";

import React from "react";
import { motion } from "framer-motion";

interface SettingsPanelProps {
  settings: { sleepGoal: number; theme: string };
  onSettingsChange: (settings: { sleepGoal: number; theme: string }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-white">Settings</h2>
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <label
            htmlFor="sleepGoal"
            className="block text-lg font-medium text-gray-200 mb-2"
          >
            Daily Sleep Goal
          </label>
          <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2 max-w-xs">
            <input
              type="range"
              id="sleepGoal"
              min="4"
              max="12"
              step="0.5"
              value={settings.sleepGoal}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  sleepGoal: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-bold text-white w-20 text-center">
              {settings.sleepGoal} hours
            </span>
          </div>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-200 mb-2">
            Notifications
          </label>
          <div className="flex items-center justify-between max-w-xs">
            <p className="text-gray-300">Bedtime reminders</p>
            <label
              htmlFor="toggle"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input type="checkbox" id="toggle" className="sr-only" />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;
