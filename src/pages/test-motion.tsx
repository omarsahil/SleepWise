"use client";
import { motion } from "framer-motion";

export default function TestMotion() {
  return <motion.div animate={{ opacity: 1 }}>Hello Motion</motion.div>;
}
