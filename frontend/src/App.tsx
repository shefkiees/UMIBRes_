import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminAuditLogsPage } from "./pages/Admin/AdminAuditLogsPage";
import { AdminRolesPage } from "./pages/Admin/AdminRolesPage";
import { AdminSettingsPage } from "./pages/Admin/AdminSettingsPage";
import { AdminUsersPage } from "./pages/Admin/AdminUsersPage";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="system_admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
