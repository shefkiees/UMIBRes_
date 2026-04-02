import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", hint: "KPIs and system status", to: "/admin/dashboard" },
  { label: "Users", hint: "Manage accounts and profiles", to: "/admin/users" },
  { label: "Roles", hint: "Access levels and permissions", to: "/admin/roles" },
  { label: "Audit Logs", hint: "Track platform activity", to: "/admin/audit-logs" },
  { label: "Settings", hint: "Configuration and access", to: "/admin/settings" },
];

type SidebarProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`}>
      <div className="sidebar__brand">
        <span className="sidebar__badge">RMS</span>
        <div>
          <strong>UMIBRes</strong>
          <p>Admin console</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Administrator navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
            to={item.to}
            onClick={onNavigate}
          >
            <span>{item.label}</span>
            <small>{item.hint}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
