import { publicApiClient } from "@/shared/api";
import { requestWithClient } from "@/shared/api/core";

import { type LoginResponse } from "./types";

export const exchangeAuthAPI = (exchangeCode: string): Promise<LoginResponse> =>
  requestWithClient<LoginResponse>(publicApiClient, {
    url: "/auth/exchange",
    method: "POST",
    data: {
      exchangeCode,
    },
  });
