"use client";

import { useState, useEffect } from "react";
import { fetchMetaAds, MetaAdsRow } from "@/lib/queries";

export interface MetaAdsAggregated {
  impressions: number;
  clicks: number;
  spend: number;
  purchases: number;
  revenue: number;
  leads: number;
  addToCart: number;
  initiateCheckout: number;
  ctr: number;
  cpl: number;
  cpc: number;
  cpm: number;
  roas: number;
  cpa: number;
}

export interface WeeklyData {
  week: string;
  clicks: number;
  leads: number;
  cpl: number;
}

export interface CreativeData {
  ad_name: string;
  thumbnail_url: string;
  impressions: number;
  clicks: number;
  spend: number;
  purchases: number;
  revenue: number;
  leads: number;
  cpl: number;
}

export interface AdsetData {
  adset_name: string;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  leads: number;
  ctr: number;
  cpl: number;
  purchases: number;
  cpa: number;
}

function aggregateData(rows: MetaAdsRow[]): MetaAdsAggregated {
  const impressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
  const clicks = rows.reduce((s, r) => s + (r.link_clicks || 0), 0);
  const spend = rows.reduce((s, r) => s + (r.spend || 0), 0);
  const purchases = rows.reduce((s, r) => s + (r.actions_offsite_conversion_fb_pixel_purchase || 0), 0);
  const revenue = rows.reduce((s, r) => s + (r.action_values_omni_purchase || 0), 0);
  const addToCart = rows.reduce((s, r) => s + (r.actions_add_to_cart || 0), 0);
  const initiateCheckout = rows.reduce((s, r) => s + (r.actions_initiate_checkout || 0), 0);
  const leads = initiateCheckout + addToCart;

  return {
    impressions,
    clicks,
    spend,
    purchases,
    revenue,
    leads,
    addToCart,
    initiateCheckout,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    cpl: leads > 0 ? spend / leads : 0,
    cpc: clicks > 0 ? spend / clicks : 0,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
  };
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getWeeklyData(rows: MetaAdsRow[]): WeeklyData[] {
  const weekMap = new Map<string, { clicks: number; leads: number; spend: number }>();

  for (const row of rows) {
    const date = parseLocalDate(row.date);
    const day = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - ((day === 0 ? 7 : day) - 1));
    const key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    const existing = weekMap.get(key) || { clicks: 0, leads: 0, spend: 0 };
    existing.clicks += row.link_clicks || 0;
    existing.leads += (row.actions_add_to_cart || 0) + (row.actions_initiate_checkout || 0);
    existing.spend += row.spend || 0;
    weekMap.set(key, existing);
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: parseLocalDate(week).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      clicks: data.clicks,
      leads: data.leads,
      cpl: data.leads > 0 ? data.spend / data.leads : 0,
    }));
}

function getCreativeData(rows: MetaAdsRow[]): CreativeData[] {
  const creativeMap = new Map<string, CreativeData>();

  for (const row of rows) {
    const name = row.ad_name;
    const existing = creativeMap.get(name) || {
      ad_name: name,
      thumbnail_url: row.thumbnail_url,
      impressions: 0,
      clicks: 0,
      spend: 0,
      purchases: 0,
      revenue: 0,
      leads: 0,
      cpl: 0,
    };

    existing.impressions += row.impressions || 0;
    existing.clicks += row.link_clicks || 0;
    existing.spend += row.spend || 0;
    existing.purchases += row.actions_offsite_conversion_fb_pixel_purchase || 0;
    existing.revenue += row.action_values_omni_purchase || 0;
    existing.leads += (row.actions_add_to_cart || 0) + (row.actions_initiate_checkout || 0);
    if (!existing.thumbnail_url && row.thumbnail_url) existing.thumbnail_url = row.thumbnail_url;
    creativeMap.set(name, existing);
  }

  const result = Array.from(creativeMap.values());
  result.forEach((c) => (c.cpl = c.leads > 0 ? c.spend / c.leads : 0));
  return result.sort((a, b) => b.spend - a.spend);
}

function getAdsetData(rows: MetaAdsRow[]): { leads: AdsetData[]; purchases: AdsetData[] } {
  const adsetMap = new Map<string, {
    impressions: number; clicks: number; spend: number;
    purchases: number; leads: number; uniqueUsers: Set<string>;
  }>();

  for (const row of rows) {
    const name = row.adset_name;
    const existing = adsetMap.get(name) || {
      impressions: 0, clicks: 0, spend: 0, purchases: 0, leads: 0, uniqueUsers: new Set(),
    };
    existing.impressions += row.impressions || 0;
    existing.clicks += row.link_clicks || 0;
    existing.spend += row.spend || 0;
    existing.purchases += row.actions_offsite_conversion_fb_pixel_purchase || 0;
    existing.leads += (row.actions_add_to_cart || 0) + (row.actions_initiate_checkout || 0);
    existing.uniqueUsers.add(row.date);
    adsetMap.set(name, existing);
  }

  const allAdsets: AdsetData[] = Array.from(adsetMap.entries()).map(([name, d]) => ({
    adset_name: name,
    impressions: d.impressions,
    reach: d.uniqueUsers.size > 0 ? Math.round(d.impressions / (d.impressions / (d.uniqueUsers.size * 100))) : 0,
    frequency: d.uniqueUsers.size > 0 ? d.impressions / (d.uniqueUsers.size * 100) : 0,
    clicks: d.clicks,
    leads: d.leads,
    ctr: d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
    cpl: d.leads > 0 ? d.spend / d.leads : 0,
    purchases: d.purchases,
    cpa: d.purchases > 0 ? d.spend / d.purchases : 0,
  }));

  return {
    leads: [...allAdsets].sort((a, b) => b.leads - a.leads),
    purchases: [...allAdsets].sort((a, b) => b.purchases - a.purchases),
  };
}

export function useMetaAds(startDate: string, endDate: string) {
  const [rawData, setRawData] = useState<MetaAdsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMetaAds(startDate, endDate).then((data) => {
      setRawData(data);
      setLoading(false);
    });
  }, [startDate, endDate]);

  const aggregated = aggregateData(rawData);
  const weeklyData = getWeeklyData(rawData);
  const creatives = getCreativeData(rawData);
  const adsetData = getAdsetData(rawData);

  // Campaign splits
  const purchaseCampaignRows = rawData.filter((r) =>
    r.campaign.toLowerCase().includes("venda") || r.campaign.toLowerCase().includes("compra") || r.campaign.toLowerCase().includes("conversion")
  );
  const leadCampaignRows = rawData.filter((r) =>
    r.campaign.toLowerCase().includes("lead") || r.campaign.toLowerCase().includes("tráfego") || r.campaign.toLowerCase().includes("tr\u00e1fego")
  );

  const purchaseCampaign = aggregateData(purchaseCampaignRows.length > 0 ? purchaseCampaignRows : rawData);
  const leadCampaign = aggregateData(leadCampaignRows.length > 0 ? leadCampaignRows : rawData);

  return {
    rawData,
    loading,
    aggregated,
    weeklyData,
    creatives,
    adsetData,
    purchaseCampaign,
    leadCampaign,
  };
}
