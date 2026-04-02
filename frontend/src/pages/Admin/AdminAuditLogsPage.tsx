const auditEvents = [
  { action: "Role updated", actor: "System Administrator", target: "Mira Daka", time: "09:14" },
  { action: "Login attempt", actor: "Arta Kelmendi", target: "Admin portal", time: "08:52" },
  { action: "Settings change", actor: "System Administrator", target: "Notification policy", time: "Yesterday" },
];

export function AdminAuditLogsPage() {
  return (
    <section className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Compliance</p>
          <h2>Audit logs</h2>
          <p>Track administrative activity, platform changes, and access-sensitive events.</p>
        </div>
      </section>

      <article className="surface-card">
        <div className="section-heading">
          <div>
            <h3>Recent log entries</h3>
            <p>Demo records shown until the backend audit feed is connected.</p>
          </div>
          <span className="data-badge is-fallback">Demo log stream</span>
        </div>

        <div className="timeline">
          {auditEvents.map((event) => (
            <article className="timeline-item" key={`${event.action}-${event.time}`}>
              <div className="timeline-item__marker" aria-hidden="true" />
              <div>
                <strong>{event.action}</strong>
                <p>
                  {event.actor} affected {event.target}.
                </p>
              </div>
              <time>{event.time}</time>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
