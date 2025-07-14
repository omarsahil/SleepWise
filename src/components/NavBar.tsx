"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import { Bed, PlusCircle } from "lucide-react";
import CalendarDashboard from "./CalendarDashboard";

interface NavItem {
  page: string;
  icon: React.ReactNode;
  label: string;
}

interface NavBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  navItems: NavItem[];
  onLogClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  activePage,
  setActivePage,
  navItems,
  onLogClick,
}) => {
  // Home always first, Analysis second, then +Log, then the rest
  const homeItem = navItems.find((item) => item.page === "home");
  const analysisItem = navItems.find((item) => item.page === "analysis");
  const restItems = navItems.filter(
    (item) => item.page !== "home" && item.page !== "analysis"
  );

  return (
    <nav className="fixed bottom-0 left-0 w-full md:relative md:w-24 bg-gray-800/50 backdrop-blur-lg border-t md:border-t-0 md:border-r border-gray-700/50 z-20 flex md:flex-col md:justify-between md:h-screen">
      <div className="hidden md:block text-center mt-8 mb-8">
        <Bed size={32} className="mx-auto text-purple-400" />
      </div>
      <div className="flex flex-1 w-full md:flex-col md:justify-center md:gap-6 gap-0 justify-between">
        {/* Navigation links */}
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`relative flex flex-col items-center justify-center space-y-1 w-full py-2 px-1 rounded-lg transition-colors duration-200 ${
              activePage === item.page
                ? "text-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
            {activePage === item.page && (
              <motion.div
                className="absolute bottom-0 h-1 w-8 bg-purple-500 rounded-full"
                layoutId="underline"
              />
            )}
          </button>
        ))}
      </div>
      {/* Remove CalendarDashboard from NavBar, restore UserButton to bottom */}
      <div className="flex justify-center md:mb-8 mb-2 w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default NavBar;
