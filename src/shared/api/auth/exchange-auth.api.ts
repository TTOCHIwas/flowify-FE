import { request } from "../core";

import type { LoginResponse } from "./types";

export const exchangeAuthAPI = (exchangeCode: string): Promise<LoginResponse> =>
  request<LoginResponse>({
    url: "/auth/exchange",
    method: "POST",
    data: {
      exchangeCode,
    },
  });
