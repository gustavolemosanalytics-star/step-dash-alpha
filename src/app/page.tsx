"use client";

import { Header } from "@/components/layout/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MetricBadge } from "@/components/dashboard/metric-badge";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton";
import { useDateRange } from "@/hooks/use-date-range";
import { useMetaAds } from "@/hooks/use-meta-ads";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/format";
import { motion } from "framer-motion";

export default function OverviewPage() {
  const { dateRange, setRange, startDate, endDate } = useDateRange(30);
  const { loading, aggregated, weeklyData, purchaseCampaign, leadCampaign } = useMetaAds(startDate, endDate);

  if (loading) return <LoadingSkeleton />;

  const connectRate = aggregated.clicks > 0 ? (aggregated.leads / aggregated.clicks) * 100 : 0;
  const leadsRate = aggregated.clicks > 0 ? (aggregated.leads / aggregated.clicks) * 100 : 0;
  const purchaseRate = aggregated.leads > 0 ? (aggregated.purchases / aggregated.leads) * 100 : 0;

  return (
    <div className="space-y-6">
      <Header
        title="Visão Geral"
        subtitle="Desempenho Geral"
        dateRange={dateRange}
        onDateChange={setRange}
      />

      {/* Top row: Connect Rate */}
      <div className="flex justify-end">
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-right">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Connect Rate%</p>
          <p className="text-[10px] text-muted-foreground">Média do Mercado: 70 - &gt; 85%</p>
          <p className="text-primary font-bold text-2xl mt-1">{formatPercent(connectRate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Funnel KPIs */}
        <div className="lg:col-span-4 space-y-3">
          <KpiCard label="Impressões" value={formatNumber(aggregated.impressions)} />

          <div className="flex items-center gap-3">
            <MetricBadge label="CTR%" value={formatPercent(aggregated.ctr)} />
            <span className="text-[10px] text-muted-foreground">
              Média do Mercado: 1 - 2%
            </span>
          </div>

          <KpiCard label="Cliques" value={formatNumber(aggregated.clicks)} />

          <div className="flex items-center gap-3">
            <MetricBadge label="% Leads" value={formatPercent(leadsRate)} />
            <span className="text-[10px] text-muted-foreground">
              % Leads Média do Mercado: ~8%
            </span>
          </div>

          <KpiCard label="Leads" value={formatNumber(aggregated.leads)} />

          <div className="flex items-center gap-3">
            <MetricBadge label="% Compras" value={formatPercent(purchaseRate)} />
            <span className="text-[10px] text-muted-foreground">
              % Compras Média do Mercado: ~30%
            </span>
          </div>

          <KpiCard label="Compras" value={formatNumber(aggregated.purchases)} />

          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">CPA / CAC</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(aggregated.cpa)}</p>
          </div>
        </div>

        {/* Right column: Stats + Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Investimento" value={formatCurrency(aggregated.spend)} variant="small" />
            <KpiCard label="ROAS" value={aggregated.roas.toFixed(1).replace(".", ",")} variant="small" />
            <KpiCard label="CPL" value={formatCurrency(aggregated.cpl)} variant="small" />
            <KpiCard label="Connect Rate" value={formatPercent(connectRate)} variant="highlight" />
          </div>

          <WeeklyChart
            data={weeklyData}
            title="Desempenho Semanal"
            subtitle="Leads vs Cliques"
            dualAxis
            lines={[
              { dataKey: "clicks", name: "Cliques", color: "hsl(0 0% 60%)", yAxisId: "left" },
              { dataKey: "leads", name: "Leads", color: "hsl(43 72% 52%)", yAxisId: "right" },
            ]}
          />
        </div>
      </div>

      {/* Campaign sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-lg font-bold text-foreground">Campanha Compras</h3>
            <p className="text-xs text-primary">Desempenho Geral</p>
          </div>
          <div className="space-y-3">
            <KpiCard label="Impressões" value={formatNumber(purchaseCampaign.impressions)} />
            <KpiCard label="Cliques" value={formatNumber(purchaseCampaign.clicks)} />
            <KpiCard label="Compras" value={formatNumber(purchaseCampaign.purchases)} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-lg font-bold text-foreground">Campanha Leads</h3>
            <p className="text-xs text-primary">Desempenho Geral</p>
          </div>
          <div className="space-y-3">
            <KpiCard label="Impressões" value={formatNumber(leadCampaign.impressions)} />
            <KpiCard label="Cliques" value={formatNumber(leadCampaign.clicks)} />
            <KpiCard label="Leads" value={formatNumber(leadCampaign.leads)} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
