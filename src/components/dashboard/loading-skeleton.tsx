"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 h-24">
            <div className="h-3 w-20 bg-secondary rounded mb-3" />
            <div className="h-7 w-32 bg-secondary rounded" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-6 h-80">
        <div className="h-4 w-40 bg-secondary rounded mb-4" />
        <div className="h-full bg-secondary/30 rounded" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl p-5 h-64">
        <div className="h-4 w-48 bg-secondary rounded mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-secondary/30 rounded mb-2" />
        ))}
      </div>
    </div>
  );
}
