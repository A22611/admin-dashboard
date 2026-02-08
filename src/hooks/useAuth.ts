import { useState } from "react";
import api from "../api/axios";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      // Save token in localStorage
      if (res.data.token) {
        localStorage.setItem("accessToken", res.data.token);
      }

      return { success: true };
    } catch (error: any) {
      // Simplified error message extraction
      const message = error.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    } finally {
      // Finally ensures loading is always set to false regardless of success or error
      setLoading(false);
    }
  };

  return { login, loading };
}