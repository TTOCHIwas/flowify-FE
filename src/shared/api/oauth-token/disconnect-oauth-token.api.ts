import { request } from "../core";

export const disconnectOAuthTokenAPI = (service: string): Promise<void> =>
  request<void>({
    url: `/oauth-tokens/${service}`,
    method: "DELETE",
  });
