export type AdminStatTone = "positive" | "warning" | "neutral";
export type ActivityType = "alert" | "approval" | "user";

export type AdminStat = {
  id: string;
  label: string;
  value: string;
  change?: string;
  tone?: AdminStatTone;
};

export type RecentActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
};

export type AdminDashboardData = {
  stats: AdminStat[];
  recentActivity: RecentActivityItem[];
  source: "api" | "fallback";
};
