// src/store/auth/authThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./IAuthState";

// 🔹 Mock login thunk
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock users
      const mockUsers: User[] = [
        { id: "1", name: "Alice Admin", email: "admin@test.com", role: "builder" },
        { id: "2", name: "Mark Manager", email: "manager@test.com", role: "contractor" },
        { id: "3", name: "Eve Employee", email: "employee@test.com", role: "manager" },
        { id: "4", name: "Chris Client", email: "client@test.com", role: "customer" },
      ];

      const user = mockUsers.find((u) => u.email === credentials.email);

      if (!user || credentials.password !== "password") {
        throw new Error("Invalid email or password");
      }

      return {
        user,
        accessToken: "mock-token-" + user.role,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Mock logout thunk
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  return true;
});
