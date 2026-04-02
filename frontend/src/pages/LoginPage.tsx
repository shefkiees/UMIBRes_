import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ValidationErrors = {
  email?: string;
  password?: string;
  form?: string;
};

function isTestAccount(email: string, password: string) {
  return email === "ADMIN" && password === "ADMIN";
}

function validateForm(email: string, password: string): ValidationErrors {
  const errors: ValidationErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isTestAccount(email, password)) {
    return errors;
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(email, password);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      await login({ email: email.trim(), password });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Unable to sign in.",
      });
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--brand">
        <p className="eyebrow">UMIBRes Platform</p>
        <h1>Research operations, approvals, and oversight in one place.</h1>
        <p className="auth-copy">
          Access the administrator console to manage users, review activity, and monitor system health across the
          research management workflow.
        </p>
        <div className="auth-feature-list">
          <article>
            <strong>Secure access</strong>
            <p>Session persistence, protected routing, and API-based authentication.</p>
          </article>
          <article>
            <strong>System visibility</strong>
            <p>Quick KPI cards and recent administrative activity on one responsive dashboard.</p>
          </article>
        </div>
      </section>

      <section className="auth-panel auth-panel--form">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div>
            <p className="eyebrow">Administrator sign in</p>
            <h2>Welcome back</h2>
            <p>Use your institutional credentials to continue.</p>
            <p>Test account for demo access: ADMIN / ADMIN.</p>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@university.edu"
            />
            {errors.email ? <small className="field-error">{errors.email}</small> : null}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
            {errors.password ? <small className="field-error">{errors.password}</small> : null}
          </label>

          {errors.form ? <div className="form-error">{errors.form}</div> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
