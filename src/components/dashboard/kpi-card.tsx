"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  variant?: "default" | "highlight" | "small";
  variation?: { value: string; positive: boolean } | null;
  className?: string;
}

export function KpiCard({ label, value, variant = "default", variation, className = "" }: KpiCardProps) {
  const isHighlight = variant === "highlight";
  const isSmall = variant === "small";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        rounded-xl border transition-all duration-300 hover:border-primary/30
        ${isHighlight
          ? "bg-primary/10 border-primary/30 p-5"
          : isSmall
            ? "bg-card border-border p-4"
            : "bg-card border-border p-5"
        }
        ${className}
      `}
    >
      <p className={`font-medium mb-1 ${isSmall ? "text-xs" : "text-xs"} ${isHighlight ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`font-bold tracking-tight ${isSmall ? "text-xl" : isHighlight ? "text-2xl text-primary" : "text-3xl"} text-foreground`}>
        {value}
      </p>
      {variation && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${variation.positive ? "text-emerald-400" : "text-red-400"}`}>
          {variation.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {variation.value}
        </div>
      )}
    </motion.div>
  );
}
