import { request } from "../core";

import type { LoginResponse } from "./types";

export const refreshAuthAPI = (refreshToken: string): Promise<LoginResponse> =>
  request<LoginResponse>({
    url: "/auth/refresh",
    method: "POST",
    data: {
      refreshToken,
    },
  });
