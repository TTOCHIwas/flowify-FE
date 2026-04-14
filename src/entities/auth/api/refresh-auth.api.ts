import { publicApiClient } from "@/shared/api";
import { requestWithClient } from "@/shared/api/core";

import type { LoginResponse } from "./types";

export const refreshAuthAPI = (refreshToken: string): Promise<LoginResponse> =>
  requestWithClient<LoginResponse>(publicApiClient, {
    url: "/auth/refresh",
    method: "POST",
    data: {
      refreshToken,
    },
  });
