import { request } from "@/shared/api/core";

export const logoutAuthAPI = (): Promise<void> =>
  request<void>({
    url: "/auth/logout",
    method: "POST",
  });
