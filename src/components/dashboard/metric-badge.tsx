"use client";

import { motion } from "framer-motion";

interface MetricBadgeProps {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
}

export function MetricBadge({ label, value, sublabel, className = "" }: MetricBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex flex-col items-center bg-primary text-primary-foreground rounded-xl px-4 py-2 ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">{label}</span>
      <span className="text-lg font-bold">{value}</span>
      {sublabel && <span className="text-[10px] opacity-70">{sublabel}</span>}
    </motion.div>
  );
}
