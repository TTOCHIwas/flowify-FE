import { publicApiClient } from "../client";
import { requestWithClient } from "../core";

import type { LoginResponse } from "./types";

export const refreshAuthAPI = (refreshToken: string): Promise<LoginResponse> =>
  requestWithClient<LoginResponse>(publicApiClient, {
    url: "/auth/refresh",
    method: "POST",
    data: {
      refreshToken,
    },
  });
