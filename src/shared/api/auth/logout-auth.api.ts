import { request } from "../core";

export const logoutAuthAPI = (): Promise<void> =>
  request<void>({
    url: "/auth/logout",
    method: "POST",
  });
