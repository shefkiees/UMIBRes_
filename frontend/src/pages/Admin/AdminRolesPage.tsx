const roleCards = [
  { title: "system_admin", description: "Full platform oversight, settings access, and audit visibility." },
  { title: "faculty_reviewer", description: "Approves academic workflows and validates submissions." },
  { title: "research_coordinator", description: "Supports departmental processes and metadata quality." },
];

export function AdminRolesPage() {
  return (
    <section className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Access Control</p>
          <h2>Roles and permissions</h2>
          <p>Manage machine-readable roles and keep access logic consistent across the frontend.</p>
        </div>
      </section>

      <section className="card-grid card-grid--three">
        {roleCards.map((role) => (
          <article className="surface-card" key={role.title}>
            <div className="section-heading">
              <div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </div>
            </div>
            <ul className="feature-list">
              <li>Standardized naming for routing and auth checks</li>
              <li>Prepared for backend role expansion</li>
              <li>Designed for clear policy ownership</li>
            </ul>
          </article>
        ))}
      </section>
    </section>
  );
}
