"use client";

import { useState, useEffect } from "react";
import { fetchGA4, GA4Row } from "@/lib/queries";

export interface GA4Aggregated {
  sessions: number;
  totalusers: number;
  newusers: number;
  engagementRate: number;
  purchases: number;
  revenue: number;
  checkouts: number;
  addToCarts: number;
}

export interface GA4WeeklyData {
  week: string;
  sessions: number;
  newusers: number;
}

export interface SourceData {
  source_medium: string;
  sessions: number;
  totalusers: number;
  newusers: number;
  engagementRate: number;
  purchases: number;
  revenue: number;
}

export interface GA4CampaignData {
  campaign: string;
  sessions: number;
  totalusers: number;
  newusers: number;
  engagementRate: number;
  purchases: number;
  revenue: number;
}

function aggregateData(rows: GA4Row[]): GA4Aggregated {
  const sessions = rows.reduce((s, r) => s + (r.sessions || 0), 0);
  const totalusers = rows.reduce((s, r) => s + (r.totalusers || 0), 0);
  const newusers = rows.reduce((s, r) => s + (r.newusers || 0), 0);
  const purchases = rows.reduce((s, r) => s + (r.ecommerce_purchases || 0), 0);
  const revenue = rows.reduce((s, r) => s + (r.purchase_revenue || 0), 0);
  const checkouts = rows.reduce((s, r) => s + (r.checkouts || 0), 0);
  const addToCarts = rows.reduce((s, r) => s + (r.add_to_carts || 0), 0);

  const totalEngagement = rows.reduce((s, r) => s + (parseFloat(r.engagement_rate) || 0) * (r.sessions || 0), 0);
  const engagementRate = sessions > 0 ? (totalEngagement / sessions) * 100 : 0;

  return {
    sessions,
    totalusers,
    newusers,
    engagementRate,
    purchases,
    revenue,
    checkouts,
    addToCarts,
  };
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getWeeklyData(rows: GA4Row[]): GA4WeeklyData[] {
  const weekMap = new Map<string, { sessions: number; newusers: number }>();

  for (const row of rows) {
    const date = parseLocalDate(row.date);
    const day = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - ((day === 0 ? 7 : day) - 1));
    const key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    const existing = weekMap.get(key) || { sessions: 0, newusers: 0 };
    existing.sessions += row.sessions || 0;
    existing.newusers += row.newusers || 0;
    weekMap.set(key, existing);
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: parseLocalDate(week).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      sessions: data.sessions,
      newusers: data.newusers,
    }));
}

function getSourceData(rows: GA4Row[]): SourceData[] {
  const map = new Map<string, { sessions: number; totalusers: number; newusers: number; engWeighted: number; purchases: number; revenue: number }>();

  for (const row of rows) {
    const name = row.session_source_medium || "(direto)";
    const existing = map.get(name) || { sessions: 0, totalusers: 0, newusers: 0, engWeighted: 0, purchases: 0, revenue: 0 };
    existing.sessions += row.sessions || 0;
    existing.totalusers += row.totalusers || 0;
    existing.newusers += row.newusers || 0;
    existing.engWeighted += (parseFloat(row.engagement_rate) || 0) * (row.sessions || 0);
    existing.purchases += row.ecommerce_purchases || 0;
    existing.revenue += row.purchase_revenue || 0;
    map.set(name, existing);
  }

  return Array.from(map.entries())
    .map(([name, d]) => ({
      source_medium: name,
      sessions: d.sessions,
      totalusers: d.totalusers,
      newusers: d.newusers,
      engagementRate: d.sessions > 0 ? (d.engWeighted / d.sessions) * 100 : 0,
      purchases: d.purchases,
      revenue: d.revenue,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

function getCampaignData(rows: GA4Row[]): GA4CampaignData[] {
  const map = new Map<string, { sessions: number; totalusers: number; newusers: number; engWeighted: number; purchases: number; revenue: number }>();

  for (const row of rows) {
    const name = row.campaign || "(sem campanha)";
    const existing = map.get(name) || { sessions: 0, totalusers: 0, newusers: 0, engWeighted: 0, purchases: 0, revenue: 0 };
    existing.sessions += row.sessions || 0;
    existing.totalusers += row.totalusers || 0;
    existing.newusers += row.newusers || 0;
    existing.engWeighted += (parseFloat(row.engagement_rate) || 0) * (row.sessions || 0);
    existing.purchases += row.ecommerce_purchases || 0;
    existing.revenue += row.purchase_revenue || 0;
    map.set(name, existing);
  }

  return Array.from(map.entries())
    .map(([name, d]) => ({
      campaign: name,
      sessions: d.sessions,
      totalusers: d.totalusers,
      newusers: d.newusers,
      engagementRate: d.sessions > 0 ? (d.engWeighted / d.sessions) * 100 : 0,
      purchases: d.purchases,
      revenue: d.revenue,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function useGA4(startDate: string, endDate: string) {
  const [rawData, setRawData] = useState<GA4Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGA4(startDate, endDate).then((data) => {
      setRawData(data);
      setLoading(false);
    });
  }, [startDate, endDate]);

  const aggregated = aggregateData(rawData);
  const weeklyData = getWeeklyData(rawData);
  const sourceData = getSourceData(rawData);
  const campaignData = getCampaignData(rawData);

  return {
    rawData,
    loading,
    aggregated,
    weeklyData,
    sourceData,
    campaignData,
  };
}
