import { createContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest } from "../api/auth";
import type { AuthContextValue, AuthSession, LoginPayload } from "../types/auth";

const STORAGE_KEY = "umibres.auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): AuthSession | null {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      async login(credentials: LoginPayload) {
        setIsLoading(true);

        try {
          const response = await loginRequest(credentials);
          setSession(response.session);
          return response;
        } finally {
          setIsLoading(false);
        }
      },
      logout() {
        setSession(null);
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
