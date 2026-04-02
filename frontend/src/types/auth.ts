export type UserRole = "system_admin" | "unknown";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthSession = {
  token: string;
  refreshToken?: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  session: AuthSession;
  message: string;
};

export type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
};
