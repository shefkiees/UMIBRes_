import { useEffect, useState } from "react";
import { fetchAdminDashboard, getDashboardFallback } from "../../api/admin";
import { StatCard } from "../../components/ui/StatCard";
import { useAuth } from "../../hooks/useAuth";
import type { AdminDashboardData } from "../../types/admin";

export function AdminDashboard() {
  const { session } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>(getDashboardFallback());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!session?.token) {
        return;
      }

      setIsLoading(true);

      try {
        const data = await fetchAdminDashboard(session.token);
        if (isMounted) {
          setDashboardData(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [session?.token]);

  if (!session) {
    return null;
  }

  return (
    <section className="page-stack">
      <section className="dashboard-overview">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Platform status at a glance</h2>
        </div>
        <span className={`data-badge ${dashboardData.source === "api" ? "is-live" : "is-fallback"}`}>
          {dashboardData.source === "api" ? "Live data" : "Demo data"}
        </span>
      </section>

      <section className="stats-grid">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="dashboard-panels">
        <article className="surface-card">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h3>Administrative events</h3>
            </div>
            {isLoading ? <span className="loading-pill">Refreshing...</span> : null}
          </div>

          <div className="activity-list">
            {dashboardData.recentActivity.map((item) => (
              <article className="activity-item" key={item.id}>
                <div className={`activity-dot type-${item.type}`} aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <time>{item.timestamp}</time>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="panel__header">
            <div>
              <p className="eyebrow">System focus</p>
              <h3>Today&apos;s priorities</h3>
            </div>
          </div>

          <div className="list-panel">
            <article>
              <strong>Environment</strong>
              <p>{dashboardData.source === "api" ? "Connected to live services" : "Using fallback demo data"}</p>
            </article>
            <article>
              <strong>Primary role</strong>
              <p>{session.user.role}</p>
            </article>
            <article>
              <strong>Next milestone</strong>
              <p>Connect real user, role, and audit data sources from the backend.</p>
            </article>
          </div>

          <div className="priority-list">
            <article>
              <strong>Review pending approvals</strong>
              <p>Resolve publication and reimbursement items waiting for admin action.</p>
            </article>
            <article>
              <strong>Monitor infrastructure warnings</strong>
              <p>Investigate long-running jobs and validate automated backups completed successfully.</p>
            </article>
            <article>
              <strong>Audit recent role changes</strong>
              <p>Verify elevated permissions were assigned correctly and only to authorized staff.</p>
            </article>
          </div>
        </article>
      </section>
    </section>
  );
}
