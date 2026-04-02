const userRows = [
  { name: "Arta Kelmendi", email: "arta.kelmendi@umibres.edu", role: "Research Coordinator", status: "Active" },
  { name: "Luan Hoxha", email: "luan.hoxha@umibres.edu", role: "Faculty Reviewer", status: "Pending" },
  { name: "Mira Daka", email: "mira.daka@umibres.edu", role: "System Administrator", status: "Active" },
];

export function AdminUsersPage() {
  return (
    <section className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>User management</h2>
          <p>Review institutional accounts, onboarding state, and administrator access across the platform.</p>
        </div>
        <button className="secondary-button" type="button">
          Invite user
        </button>
      </section>

      <section className="content-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Recent user accounts</h3>
              <p>Representative records for the current demo state.</p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userRows.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-pill${user.status === "Active" ? " is-positive" : ""}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Admin notes</h3>
              <p>Operational reminders for identity and access management.</p>
            </div>
          </div>
          <div className="list-panel">
            <article>
              <strong>Review inactive accounts weekly</strong>
              <p>Archive dormant accounts to reduce permission drift.</p>
            </article>
            <article>
              <strong>Confirm onboarding ownership</strong>
              <p>Make sure faculty-level access is approved by the correct unit lead.</p>
            </article>
            <article>
              <strong>Track elevated privileges</strong>
              <p>Administrators and reviewers should be audited against policy each month.</p>
            </article>
          </div>
        </article>
      </section>
    </section>
  );
}
