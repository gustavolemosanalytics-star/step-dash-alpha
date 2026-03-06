/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Header } from "@/components/layout/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useGA4, SourceData, GA4CampaignData } from "@/hooks/use-ga4";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/format";

export default function GoogleAnalyticsPage() {
  const { dateRange, setRange, startDate, endDate } = useDateRange(30);
  const { loading, aggregated, weeklyData, sourceData, campaignData } = useGA4(startDate, endDate);

  if (loading) return <LoadingSkeleton />;

  if (aggregated.sessions === 0) {
    return (
      <div className="space-y-6">
        <Header title="Google Analytics" subtitle="Desempenho Geral" dateRange={dateRange} onDateChange={setRange} />
        <EmptyState title="Sem dados disponíveis" description="Não foram encontrados dados de Google Analytics para o período selecionado." />
      </div>
    );
  }

  const sourceColumns: Column<SourceData>[] = [
    {
      key: "source_medium",
      label: "Fonte / Meio",
      render: (row) => <span className="text-xs font-medium max-w-[250px] truncate block">{row.source_medium}</span>,
    },
    { key: "sessions", label: "Sessões", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.sessions)}</span> },
    { key: "totalusers", label: "Usuários", align: "right", render: (row) => formatNumber(row.totalusers) },
    { key: "newusers", label: "Novos Usuários", align: "right", render: (row) => formatNumber(row.newusers) },
    { key: "engagementRate", label: "Engajamento", align: "right", render: (row) => formatPercent(row.engagementRate) },
    { key: "purchases", label: "Compras", align: "right", render: (row) => formatNumber(row.purchases) },
    { key: "revenue", label: "Receita", align: "right", render: (row) => formatCurrency(row.revenue) },
  ];

  const campaignColumns: Column<GA4CampaignData>[] = [
    {
      key: "campaign",
      label: "Campanha",
      render: (row) => <span className="text-xs font-medium max-w-[250px] truncate block">{row.campaign}</span>,
    },
    { key: "sessions", label: "Sessões", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.sessions)}</span> },
    { key: "totalusers", label: "Usuários", align: "right", render: (row) => formatNumber(row.totalusers) },
    { key: "newusers", label: "Novos Usuários", align: "right", render: (row) => formatNumber(row.newusers) },
    { key: "engagementRate", label: "Engajamento", align: "right", render: (row) => formatPercent(row.engagementRate) },
    { key: "purchases", label: "Compras", align: "right", render: (row) => formatNumber(row.purchases) },
    { key: "revenue", label: "Receita", align: "right", render: (row) => formatCurrency(row.revenue) },
  ];

  return (
    <div className="space-y-6">
      <Header title="Google Analytics" subtitle="Desempenho Geral" dateRange={dateRange} onDateChange={setRange} />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Sessões" value={formatNumber(aggregated.sessions)} variant="highlight" />
        <KpiCard label="Usuários" value={formatNumber(aggregated.totalusers)} variant="highlight" />
        <KpiCard label="Novos Usuários" value={formatNumber(aggregated.newusers)} variant="highlight" />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Taxa de Engajamento" value={formatPercent(aggregated.engagementRate)} variant="small" />
        <KpiCard label="Compras" value={formatNumber(aggregated.purchases)} variant="small" />
        <KpiCard label="Receita" value={formatCurrency(aggregated.revenue)} variant="small" />
        <KpiCard label="Checkouts" value={formatNumber(aggregated.checkouts)} variant="small" />
      </div>

      {/* Weekly chart */}
      <WeeklyChart
        data={weeklyData}
        title="Desempenho Semanal"
        subtitle="Sessões vs Novos Usuários"
        dualAxis
        lines={[
          { dataKey: "sessions", name: "Sessões", color: "hsl(142 71% 45%)", yAxisId: "left" },
          { dataKey: "newusers", name: "Novos Usuários", color: "hsl(217 91% 60%)", yAxisId: "right" },
        ]}
      />

      {/* Source/Medium table */}
      <DataTable
        title="Desempenho por Fonte / Meio"
        subtitle="Métricas Gerais"
        columns={sourceColumns}
        data={sourceData as any[]}
        pageSize={10}
      />

      {/* Campaign table */}
      <DataTable
        title="Desempenho por Campanha"
        subtitle="Métricas Gerais"
        columns={campaignColumns}
        data={campaignData as any[]}
        pageSize={10}
      />
    </div>
  );
}
