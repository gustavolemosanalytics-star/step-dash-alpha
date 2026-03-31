import { supabase, ACCOUNT_NAME } from "./supabase";

function nextDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
}

export interface MetaAdsRow {
  account_name: string;
  campaign: string;
  adset_name: string;
  ad_name: string;
  date: string;
  impressions: number;
  link_clicks: number;
  spend: number;
  cpc: number;
  cpm: number;
  actions_offsite_conversion_fb_pixel_purchase: number;
  action_values_omni_purchase: number;
  actions_add_to_cart: number;
  actions_initiate_checkout: number;
  actions_video_view: number;
  website_ctr_link_click: string;
  website_purchase_roas_offsite_conversion_fb_pixel_purchase: number;
  thumbnail_url: string;
  video_play_actions_video_view: number;
  video_p25_watched_actions_video_view: number;
  video_p50_watched_actions_video_view: number;
  video_p75_watched_actions_video_view: number;
  video_p100_watched_actions_video_view: number;
  video_thruplay_watched_actions_video_view: number;
  video_avg_time_watched_actions_video_view: number;
  video_continuous_2_sec_watched_actions_video_view: number;
  datasource: string;
  source: string;
}

export interface GoogleAdsRow {
  account_name: string;
  ad_group_name: string;
  campaign: string;
  clicks: number;
  datasource: string;
  date: string;
  impressions: number;
  keyword_text: string;
  spend: number;
}

export interface GA4Row {
  account_name: string;
  add_to_carts: number;
  campaign: string;
  checkouts: number;
  datasource: string;
  date: string;
  ecommerce_purchases: number;
  engagement_rate: string;
  newusers: number;
  purchase_revenue: number;
  session_manual_term: string;
  session_source_medium: string;
  sessions: number;
  totalusers: number;
}

export async function fetchMetaAds(startDate: string, endDate: string): Promise<MetaAdsRow[]> {
  const { data, error } = await supabase
    .from("meta_ads_step")
    .select("*")
    .eq("account_name", `${ACCOUNT_NAME}, BRL`)
    .gte("date", startDate)
    .lt("date", nextDay(endDate))
    .order("date", { ascending: true })
    .limit(10000);

  if (error) {
    console.error("Error fetching meta ads:", error);
    return [];
  }
  return data || [];
}

export async function fetchGoogleAds(startDate: string, endDate: string): Promise<GoogleAdsRow[]> {
  const { data, error } = await supabase
    .from("google_ads_step")
    .select("*")
    .eq("account_name", "Rede Alpha Fitness")
    .gte("date", startDate)
    .lt("date", nextDay(endDate))
    .order("date", { ascending: true })
    .limit(10000);

  if (error) {
    console.error("Error fetching google ads:", error);
    return [];
  }
  return data || [];
}

export async function fetchGA4(startDate: string, endDate: string): Promise<GA4Row[]> {
  const { data, error } = await supabase
    .from("ga4_ads_step")
    .select("*")
    .eq("account_name", "Alpha Fitness \u2013 GA4")
    .gte("date", startDate)
    .lt("date", nextDay(endDate))
    .order("date", { ascending: true })
    .limit(10000);

  if (error) {
    console.error("Error fetching ga4:", error);
    return [];
  }
  return data || [];
}
