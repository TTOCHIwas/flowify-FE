import { publicApiClient } from "../client";
import { requestWithClient } from "../core";

import type { LoginResponse } from "./types";

export const exchangeAuthAPI = (exchangeCode: string): Promise<LoginResponse> =>
  requestWithClient<LoginResponse>(publicApiClient, {
    url: "/auth/exchange",
    method: "POST",
    data: {
      exchangeCode,
    },
  });
