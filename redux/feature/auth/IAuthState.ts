
export type Role = "builder" | "contractor" | "manager" | "customer";

export interface ApiResponse<T = any, E = any> {
  data: T;
  message?: string;
  status?: string;
  error?: E;
  [key: string]: any;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}


export interface LoginResponse {
 accessToken: string;
 refreshToken: string;
}
