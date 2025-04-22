import { createFileRoute, redirect } from "@tanstack/react-router";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return redirect({
        to: "/login",
      });
    }

    try {
      // Verify token by calling /auth/me
      await authApi.getCurrentUser();
      // If successful, redirect to dashboard
      return redirect({
        to: "/dashboard",
      });
    } catch (err) {
      // If token is invalid, remove it and redirect to login
      localStorage.removeItem('token');
      return redirect({
        to: "/login",
      });
    }
  },
});
