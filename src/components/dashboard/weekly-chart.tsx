"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface WeeklyChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  title: string;
  subtitle?: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
    yAxisId?: string;
  }>;
  dualAxis?: boolean;
}

export function WeeklyChart({ data, title, subtitle, lines, dualAxis }: WeeklyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {lines.map((line) => (
          <div key={line.dataKey} className="flex items-center gap-2">
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: line.color }} />
            <span className="text-xs text-muted-foreground">{line.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
          <XAxis
            dataKey="week"
            tick={{ fill: "hsl(0 0% 64%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(0 0% 14%)" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "hsl(0 0% 64%)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          {dualAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(0 0% 64%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 10%)",
              border: "1px solid hsl(0 0% 20%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(0 0% 98%)",
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3, fill: line.color }}
              activeDot={{ r: 5 }}
              yAxisId={line.yAxisId || "left"}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
