export type Role = 'builder' | 'contractor' | 'manager' | 'customer';

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
  // phone: string;
  role: Role;
  builderId: string;
  builderName: string;
  logo: string;
  slogan: string;
  firmName: string;
  abnNumber: string;
  licenseNumber: string;
  phoneNumber: string;
  isVerified: boolean;
  rootUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  roleId: string;
}
