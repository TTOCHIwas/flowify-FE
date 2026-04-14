import { exchangeAuthAPI } from "./exchange-auth.api";
import { logoutAuthAPI } from "./logout-auth.api";
import { refreshAuthAPI } from "./refresh-auth.api";

export * from "./types";

export const authApi = {
  exchange: exchangeAuthAPI,
  refresh: refreshAuthAPI,
  logout: logoutAuthAPI,
};
