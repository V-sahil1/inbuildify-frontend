
export type Role = "builder" | "contractor" | "manager" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}
