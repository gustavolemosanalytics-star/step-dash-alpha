"use client";

import { useState, useEffect } from "react";
import { fetchGoogleAds, GoogleAdsRow } from "@/lib/queries";

export interface GoogleAdsAggregated {
  impressions: number;
  clicks: number;
  spend: number;
  cpc: number;
  cpm: number;
  ctr: number;
}

export interface GoogleAdsWeeklyData {
  week: string;
  clicks: number;
  impressions: number;
}

export interface CampaignData {
  campaign: string;
  impressions: number;
  clicks: number;
  spend: number;
  cpc: number;
  ctr: number;
}

export interface KeywordData {
  keyword_text: string;
  impressions: number;
  clicks: number;
  spend: number;
  cpc: number;
  ctr: number;
}

export interface AdGroupData {
  ad_group_name: string;
  impressions: number;
  clicks: number;
  spend: number;
  cpc: number;
  ctr: number;
}

function aggregateData(rows: GoogleAdsRow[]): GoogleAdsAggregated {
  const impressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
  const clicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
  const spend = rows.reduce((s, r) => s + (r.spend || 0), 0);

  return {
    impressions,
    clicks,
    spend,
    cpc: clicks > 0 ? spend / clicks : 0,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
  };
}

function getWeeklyData(rows: GoogleAdsRow[]): GoogleAdsWeeklyData[] {
  const weekMap = new Map<string, { clicks: number; impressions: number }>();

  for (const row of rows) {
    const date = new Date(row.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split("T")[0];

    const existing = weekMap.get(key) || { clicks: 0, impressions: 0 };
    existing.clicks += row.clicks || 0;
    existing.impressions += row.impressions || 0;
    weekMap.set(key, existing);
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      clicks: data.clicks,
      impressions: data.impressions,
    }));
}

function groupBy(
  rows: GoogleAdsRow[],
  key: keyof GoogleAdsRow
): { name: string; impressions: number; clicks: number; spend: number; cpc: number; ctr: number }[] {
  const map = new Map<string, { impressions: number; clicks: number; spend: number }>();

  for (const row of rows) {
    const name = String(row[key] || "(sem nome)");
    const existing = map.get(name) || { impressions: 0, clicks: 0, spend: 0 };
    existing.impressions += row.impressions || 0;
    existing.clicks += row.clicks || 0;
    existing.spend += row.spend || 0;
    map.set(name, existing);
  }

  return Array.from(map.entries())
    .map(([name, d]) => ({
      name,
      impressions: d.impressions,
      clicks: d.clicks,
      spend: d.spend,
      cpc: d.clicks > 0 ? d.spend / d.clicks : 0,
      ctr: d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);
}

export function useGoogleAds(startDate: string, endDate: string) {
  const [rawData, setRawData] = useState<GoogleAdsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGoogleAds(startDate, endDate).then((data) => {
      setRawData(data);
      setLoading(false);
    });
  }, [startDate, endDate]);

  const aggregated = aggregateData(rawData);
  const weeklyData = getWeeklyData(rawData);

  const campaignRows = groupBy(rawData, "campaign");
  const campaignData: CampaignData[] = campaignRows.map((r) => ({ campaign: r.name, ...r }));

  const keywordRows = groupBy(rawData, "keyword_text");
  const keywordData: KeywordData[] = keywordRows.map((r) => ({ keyword_text: r.name, ...r }));

  const adGroupRows = groupBy(rawData, "ad_group_name");
  const adGroupData: AdGroupData[] = adGroupRows.map((r) => ({ ad_group_name: r.name, ...r }));

  return {
    rawData,
    loading,
    aggregated,
    weeklyData,
    campaignData,
    keywordData,
    adGroupData,
  };
}
