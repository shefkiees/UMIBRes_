import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

const pageTitles: Record<string, { title: string; eyebrow: string }> = {
  "/admin/dashboard": { title: "System Administrator Dashboard", eyebrow: "Research Management System" },
  "/admin/users": { title: "Users", eyebrow: "Administration" },
  "/admin/roles": { title: "Roles", eyebrow: "Administration" },
  "/admin/audit-logs": { title: "Audit Logs", eyebrow: "Administration" },
  "/admin/settings": { title: "Settings", eyebrow: "Administration" },
};

export function AdminLayout() {
  const { logout, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!session) {
    return null;
  }

  const currentPage = pageTitles[location.pathname] ?? pageTitles["/admin/dashboard"];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      <div className="admin-content">
        <header className="admin-header">
          <div>
            <p className="eyebrow">{currentPage.eyebrow}</p>
            <h1>{currentPage.title}</h1>
          </div>
          <div className="admin-header__actions">
            <button
              aria-label="Toggle navigation"
              className="ghost-button admin-menu-button"
              type="button"
              onClick={() => setIsSidebarOpen((value) => !value)}
            >
              Menu
            </button>
            <div className="user-chip">
              <span className="user-chip__avatar">{session.user.name.charAt(0).toUpperCase()}</span>
              <div>
                <strong>{session.user.name}</strong>
                <p>{session.user.email}</p>
              </div>
            </div>
            <button className="ghost-button" type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
