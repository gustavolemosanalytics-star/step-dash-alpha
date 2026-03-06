/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Header } from "@/components/layout/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton";
import { CreativeGallery } from "@/components/meta/creative-gallery";
import { useDateRange } from "@/hooks/use-date-range";
import { useMetaAds, CreativeData, AdsetData } from "@/hooks/use-meta-ads";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/format";
import Image from "next/image";

export default function MetaAdsPage() {
  const { dateRange, setRange, startDate, endDate } = useDateRange(30);
  const { loading, aggregated, weeklyData, creatives, adsetData } = useMetaAds(startDate, endDate);

  if (loading) return <LoadingSkeleton />;

  const creativeColumns: Column<CreativeData>[] = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (row) =>
        row.thumbnail_url ? (
          <div className="relative w-10 h-10 rounded overflow-hidden bg-secondary">
            <Image src={row.thumbnail_url} alt="" fill className="object-cover" unoptimized sizes="40px" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-secondary" />
        ),
    },
    {
      key: "ad_name",
      label: "Nome do Criativo",
      render: (row) => <span className="text-xs font-medium max-w-[200px] truncate block">{row.ad_name}</span>,
    },
    { key: "spend", label: "Investimento", align: "right", render: (row) => formatCurrency(row.spend) },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => formatNumber(row.clicks) },
    { key: "leads", label: "Leads", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.leads)}</span> },
    { key: "purchases", label: "Compras", align: "right", render: (row) => formatNumber(row.purchases) },
    { key: "revenue", label: "Receita", align: "right", render: (row) => formatCurrency(row.revenue) },
    { key: "cpl", label: "CPL", align: "right", render: (row) => formatCurrency(row.cpl) },
  ];

  const adsetLeadColumns: Column<AdsetData>[] = [
    {
      key: "adset_name",
      label: "Grupo da Campanha",
      render: (row) => <span className="text-xs font-medium max-w-[200px] truncate block">{row.adset_name}</span>,
    },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => formatNumber(row.clicks) },
    { key: "leads", label: "Leads", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{row.leads}</span> },
    { key: "ctr", label: "CTR", align: "right", render: (row) => formatPercent(row.ctr) },
    { key: "cpl", label: "CPL", align: "right", render: (row) => formatCurrency(row.cpl) },
    { key: "purchases", label: "Compras", align: "right", render: (row) => formatNumber(row.purchases) },
  ];

  const adsetPurchaseColumns: Column<AdsetData>[] = [
    {
      key: "adset_name",
      label: "Grupo da Campanha",
      render: (row) => <span className="text-xs font-medium max-w-[200px] truncate block">{row.adset_name}</span>,
    },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => formatNumber(row.clicks) },
    { key: "leads", label: "Leads", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{row.leads}</span> },
    { key: "ctr", label: "CTR", align: "right", render: (row) => formatPercent(row.ctr) },
    { key: "cpa", label: "CPA / CAC", align: "right", render: (row) => formatCurrency(row.cpa) },
    { key: "purchases", label: "Compras", align: "right", render: (row) => formatNumber(row.purchases) },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Meta Ads"
        subtitle="Desempenho Geral"
        dateRange={dateRange}
        onDateChange={setRange}
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="ROAS" value={aggregated.roas.toFixed(2).replace(".", ",")} variant="highlight" />
        <KpiCard label="Compras" value={formatNumber(aggregated.purchases)} variant="highlight" />
        <KpiCard label="Investimento" value={formatCurrency(aggregated.spend)} variant="highlight" />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard label="Impressões" value={formatNumber(aggregated.impressions)} variant="small" />
        <KpiCard label="Alcance" value={formatNumber(Math.round(aggregated.impressions * 0.7))} variant="small" />
        <KpiCard label="Frequência" value={(aggregated.impressions / Math.max(1, aggregated.impressions * 0.7) * 1).toFixed(2).replace(".", ",")} variant="small" />
        <KpiCard label="CTR" value={formatPercent(aggregated.ctr)} variant="small" />
        <KpiCard label="CPL" value={formatCurrency(aggregated.cpl)} variant="small" />
      </div>

      {/* Weekly chart */}
      <WeeklyChart
        data={weeklyData}
        title="Desempenho Semanal"
        subtitle="Leads vs CPL"
        dualAxis
        lines={[
          { dataKey: "leads", name: "Leads", color: "hsl(43 72% 52%)", yAxisId: "left" },
          { dataKey: "cpl", name: "CPL", color: "hsl(0 0% 60%)", yAxisId: "right" },
        ]}
      />

      {/* Creative table */}
      <DataTable
        title="Desempenho dos Criativos - Campanha de Leads"
        subtitle="Métricas Gerais"
        columns={creativeColumns}
        data={creatives as any[]}
        pageSize={10}
      />

      {/* Creative Gallery */}
      <CreativeGallery creatives={creatives} />

      {/* Demographic tables */}
      <DataTable
        title="Desempenho Demográfico - Leads"
        subtitle="Métricas Gerais"
        columns={adsetLeadColumns}
        data={adsetData.leads as any[]}
        pageSize={6}
      />

      <DataTable
        title="Desempenho Demográfico - Compras"
        subtitle="Métricas Gerais"
        columns={adsetPurchaseColumns}
        data={adsetData.purchases as any[]}
        pageSize={5}
      />
    </div>
  );
}
