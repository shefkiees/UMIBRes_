import type { AuthSession, LoginPayload, LoginResponse, User, UserRole } from "../types/auth";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const AUTH_ENDPOINTS = ["/auth/login", "/login"];
const TEST_EMAIL = "ADMIN";
const TEST_PASSWORD = "ADMIN";

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
    return { message: text };
  }
}

function extractUser(data: Record<string, unknown>, payload: LoginPayload): User {
  const nestedUser =
    (typeof data.user === "object" && data.user !== null ? data.user : null) ||
    (typeof data.admin === "object" && data.admin !== null ? data.admin : null);

  if (nestedUser) {
    const userRecord = nestedUser as Record<string, unknown>;
    return {
      id: String(userRecord.id ?? userRecord.userId ?? payload.email),
      email: String(userRecord.email ?? payload.email),
      name: String(userRecord.name ?? userRecord.fullName ?? "System Administrator"),
      role: normalizeRole(userRecord.role),
    };
  }

  return {
    id: payload.email,
    email: payload.email,
    name: "System Administrator",
    role: "system_admin",
  };
}

function normalizeRole(value: unknown): UserRole {
  if (typeof value !== "string") {
    return "system_admin";
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return normalized === "system_admin" ? "system_admin" : "unknown";
}

function normalizeLoginResponse(data: unknown, payload: LoginPayload): AuthSession {
  if (!data || typeof data !== "object") {
    throw new Error("Unexpected authentication response.");
  }

  const record = data as Record<string, unknown>;
  const token =
    (typeof record.accessToken === "string" && record.accessToken) ||
    (typeof record.token === "string" && record.token) ||
    (typeof record.jwt === "string" && record.jwt);

  if (!token) {
    throw new Error("Authentication token was not returned by the server.");
  }

  const refreshToken =
    (typeof record.refreshToken === "string" && record.refreshToken) || undefined;

  return {
    token,
    refreshToken,
    user: extractUser(record, payload),
  };
}

function isTestAccount(payload: LoginPayload) {
  return payload.email === TEST_EMAIL && payload.password === TEST_PASSWORD;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (isTestAccount(payload)) {
    const user: User = {
      id: "admin-test-user",
      email: TEST_EMAIL,
      name: "System Administrator",
      role: "system_admin",
    };

    return {
      session: {
        token: "test-admin-token",
        user,
      },
      message: "Signed in with the test administrator account.",
    };
  }

  let lastError = "Unable to sign in.";

  for (const endpoint of AUTH_ENDPOINTS) {
    try {
      const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        if (data && typeof data === "object" && typeof (data as Record<string, unknown>).message === "string") {
          lastError = (data as Record<string, string>).message;
        } else if (response.status === 401) {
          lastError = "Invalid email or password.";
        } else {
          lastError = `Login failed with status ${response.status}.`;
        }

        continue;
      }

      return {
        session: normalizeLoginResponse(data, payload),
        message:
          data && typeof data === "object" && typeof (data as Record<string, unknown>).message === "string"
            ? String((data as Record<string, unknown>).message)
            : "Signed in successfully.",
      };
    } catch {
      lastError = "Unable to reach the authentication service.";
    }
  }

  throw new Error(lastError);
}
