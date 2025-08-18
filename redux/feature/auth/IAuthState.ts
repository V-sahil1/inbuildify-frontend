
export type Role = "builder" | "contractor" | "manager" | "customer";

export interface ApiResponse<T = any, E = any> {
  data: T;
  message?: string;
  status?: string;
  error?: E;
  [key: string]: any;
}

export enum Status {
  IDLE = "idle",
  PENDING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
 accessToken: string;
 refreshToken: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  accessToken: string | null;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}
