"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { authApi } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const { message } = App.useApp();

  const logout = useCallback(async (options?: { silent?: boolean; redirectUrl?: string }) => {
    const { silent = false, redirectUrl = "/auth/login" } = options || {};

    try {
      if (!silent) {
        message.loading({ content: "Logging out...", key: "app_logout_key", duration: 1 });
      }
      await authApi.logout().catch(() => {});
    } catch {
      // Ignore API network errors during logout
    } finally {
      // 1. Clear LocalStorage Tokens & Workspace context
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        localStorage.removeItem("active_workspace_id");
        localStorage.removeItem("activeWorkspaceId");

        // 2. Clear Session Cookies
        document.cookie = "auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "access_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      if (!silent) {
        message.success({ content: "Logged out successfully", key: "app_logout_key", duration: 1.5 });
      }

      // 3. Clean Browser Navigation
      router.push(redirectUrl);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== redirectUrl) {
          window.location.href = redirectUrl;
        }
      }, 100);
    }
  }, [message, router]);

  return {
    logout,
  };
}
