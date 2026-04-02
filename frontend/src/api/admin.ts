import type { AdminDashboardData, AdminStat, RecentActivityItem } from "../types/admin";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const DASHBOARD_ENDPOINTS = ["/admin/dashboard", "/admin/stats", "/dashboard/admin"];

function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();
  return value ? value.replace(/\/$/, "") : DEFAULT_API_BASE_URL;
}

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toStatList(data: Record<string, unknown>): AdminStat[] {
  const source =
    (Array.isArray(data.stats) && data.stats) ||
    (Array.isArray(data.cards) && data.cards) ||
    [];

  if (source.length > 0) {
    const stats = source.map<AdminStat | null>((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const record = item as Record<string, unknown>;
        return {
          id: String(record.id ?? record.label ?? index),
          label: String(record.label ?? record.title ?? `Metric ${index + 1}`),
          value: String(record.value ?? record.count ?? "0"),
          change: typeof record.change === "string" ? record.change : undefined,
          tone:
            record.tone === "positive" || record.tone === "warning" || record.tone === "neutral"
              ? record.tone
              : "neutral",
        } satisfies AdminStat;
      });

    return stats.filter((item): item is AdminStat => item !== null);
  }

  const counters: Array<[string, string]> = [
    ["Total users", String(data.totalUsers ?? data.users ?? 0)],
    ["Active researchers", String(data.activeResearchers ?? data.researchers ?? 0)],
    ["Pending approvals", String(data.pendingApprovals ?? data.pending ?? 0)],
    ["System alerts", String(data.alerts ?? data.systemAlerts ?? 0)],
  ];

  return counters.map(([label, value], index) => ({
    id: String(index),
    label,
    value,
    tone: index === 3 ? "warning" : "neutral",
  }));
}

function toActivityList(data: Record<string, unknown>): RecentActivityItem[] {
  const source =
    (Array.isArray(data.recentActivity) && data.recentActivity) ||
    (Array.isArray(data.activity) && data.activity) ||
    [];

  if (source.length > 0) {
    const activity = source.map<RecentActivityItem | null>((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const record = item as Record<string, unknown>;
        return {
          id: String(record.id ?? index),
          title: String(record.title ?? record.action ?? "Recent system event"),
          description: String(record.description ?? record.details ?? "New activity recorded by the system."),
          timestamp: String(record.timestamp ?? record.time ?? "Just now"),
          type:
            record.type === "alert" || record.type === "approval" || record.type === "user"
              ? record.type
              : "user",
        } satisfies RecentActivityItem;
      });

    return activity.filter((item): item is RecentActivityItem => item !== null);
  }

  return [];
}

export function getDashboardFallback(): AdminDashboardData {
  return {
    stats: [
      { id: "users", label: "Total users", value: "1,284", change: "+8% this month", tone: "positive" },
      { id: "researchers", label: "Active researchers", value: "342", change: "+14 new this week", tone: "positive" },
      { id: "approvals", label: "Pending approvals", value: "19", change: "Needs review today", tone: "warning" },
      { id: "alerts", label: "System alerts", value: "3", change: "2 backup warnings", tone: "warning" },
    ],
    recentActivity: [
      {
        id: "1",
        title: "User role updated",
        description: "Faculty coordinator permissions were granted to a newly onboarded staff member.",
        timestamp: "5 minutes ago",
        type: "user",
      },
      {
        id: "2",
        title: "Submission approval queue changed",
        description: "Three reimbursement requests and two publication records entered admin review.",
        timestamp: "18 minutes ago",
        type: "approval",
      },
      {
        id: "3",
        title: "Nightly backup warning",
        description: "One backup job exceeded the expected runtime threshold and should be checked.",
        timestamp: "42 minutes ago",
        type: "alert",
      },
    ],
    source: "fallback",
  };
}

export async function fetchAdminDashboard(token: string): Promise<AdminDashboardData> {
  for (const endpoint of DASHBOARD_ENDPOINTS) {
    try {
      const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafely(response);

      if (!response.ok || !data || typeof data !== "object") {
        continue;
      }

      const record = data as Record<string, unknown>;
      return {
        stats: toStatList(record),
        recentActivity: toActivityList(record),
        source: "api",
      };
    } catch {
      continue;
    }
  }

  return getDashboardFallback();
}
