const settingsCards = [
  { title: "Authentication", text: "Session timeout, privileged access, and sign-in policy." },
  { title: "Notifications", text: "System-wide announcements and operational alerts." },
  { title: "Backups", text: "Daily backup visibility and restore-readiness checks." },
];

export function AdminSettingsPage() {
  return (
    <section className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>System settings</h2>
          <p>Review operational controls and the policies that shape the administrator experience.</p>
        </div>
      </section>

      <section className="card-grid card-grid--three">
        {settingsCards.map((item) => (
          <article className="surface-card" key={item.title}>
            <div className="section-heading">
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
            <button className="secondary-button" type="button">
              Review
            </button>
          </article>
        ))}
      </section>
    </section>
  );
}
