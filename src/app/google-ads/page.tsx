/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Header } from "@/components/layout/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useGoogleAds, CampaignData, KeywordData, AdGroupData } from "@/hooks/use-google-ads";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/format";

export default function GoogleAdsPage() {
  const { dateRange, setRange, startDate, endDate } = useDateRange(30);
  const { loading, aggregated, weeklyData, campaignData, keywordData, adGroupData } = useGoogleAds(startDate, endDate);

  if (loading) return <LoadingSkeleton />;

  if (aggregated.impressions === 0) {
    return (
      <div className="space-y-6">
        <Header title="Google Ads" subtitle="Desempenho Geral" dateRange={dateRange} onDateChange={setRange} />
        <EmptyState title="Sem dados disponíveis" description="Não foram encontrados dados de Google Ads para o período selecionado." />
      </div>
    );
  }

  const campaignColumns: Column<CampaignData>[] = [
    {
      key: "campaign",
      label: "Campanha",
      render: (row) => <span className="text-xs font-medium max-w-[250px] truncate block">{row.campaign}</span>,
    },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.clicks)}</span> },
    { key: "spend", label: "Investimento", align: "right", render: (row) => formatCurrency(row.spend) },
    { key: "cpc", label: "CPC", align: "right", render: (row) => formatCurrency(row.cpc) },
    { key: "ctr", label: "CTR", align: "right", render: (row) => formatPercent(row.ctr) },
  ];

  const keywordColumns: Column<KeywordData>[] = [
    {
      key: "keyword_text",
      label: "Palavra-chave",
      render: (row) => <span className="text-xs font-medium max-w-[250px] truncate block">{row.keyword_text}</span>,
    },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.clicks)}</span> },
    { key: "spend", label: "Investimento", align: "right", render: (row) => formatCurrency(row.spend) },
    { key: "cpc", label: "CPC", align: "right", render: (row) => formatCurrency(row.cpc) },
    { key: "ctr", label: "CTR", align: "right", render: (row) => formatPercent(row.ctr) },
  ];

  const adGroupColumns: Column<AdGroupData>[] = [
    {
      key: "ad_group_name",
      label: "Grupo de Anúncio",
      render: (row) => <span className="text-xs font-medium max-w-[250px] truncate block">{row.ad_group_name}</span>,
    },
    { key: "impressions", label: "Impressões", align: "right", render: (row) => formatNumber(row.impressions) },
    { key: "clicks", label: "Cliques", align: "right", render: (row) => <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">{formatNumber(row.clicks)}</span> },
    { key: "spend", label: "Investimento", align: "right", render: (row) => formatCurrency(row.spend) },
    { key: "cpc", label: "CPC", align: "right", render: (row) => formatCurrency(row.cpc) },
    { key: "ctr", label: "CTR", align: "right", render: (row) => formatPercent(row.ctr) },
  ];

  return (
    <div className="space-y-6">
      <Header title="Google Ads" subtitle="Desempenho Geral" dateRange={dateRange} onDateChange={setRange} />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Impressões" value={formatNumber(aggregated.impressions)} variant="highlight" />
        <KpiCard label="Cliques" value={formatNumber(aggregated.clicks)} variant="highlight" />
        <KpiCard label="Investimento" value={formatCurrency(aggregated.spend)} variant="highlight" />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="CPC" value={formatCurrency(aggregated.cpc)} variant="small" />
        <KpiCard label="CPM" value={formatCurrency(aggregated.cpm)} variant="small" />
        <KpiCard label="CTR" value={formatPercent(aggregated.ctr)} variant="small" />
      </div>

      {/* Weekly chart */}
      <WeeklyChart
        data={weeklyData}
        title="Desempenho Semanal"
        subtitle="Cliques vs Impressões"
        dualAxis
        lines={[
          { dataKey: "impressions", name: "Impressões", color: "hsl(0 0% 60%)", yAxisId: "left" },
          { dataKey: "clicks", name: "Cliques", color: "hsl(217 91% 60%)", yAxisId: "right" },
        ]}
      />

      {/* Campaign table */}
      <DataTable
        title="Desempenho por Campanha"
        subtitle="Métricas Gerais"
        columns={campaignColumns}
        data={campaignData as any[]}
        pageSize={10}
      />

      {/* Keyword table */}
      <DataTable
        title="Desempenho por Palavra-chave"
        subtitle="Métricas Gerais"
        columns={keywordColumns}
        data={keywordData as any[]}
        pageSize={10}
      />

      {/* Ad Group table */}
      <DataTable
        title="Desempenho por Grupo de Anúncio"
        subtitle="Métricas Gerais"
        columns={adGroupColumns}
        data={adGroupData as any[]}
        pageSize={10}
      />
    </div>
  );
}
