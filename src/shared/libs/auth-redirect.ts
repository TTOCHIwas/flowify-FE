const getApiBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
};

const getConfiguredGooglePath = () => import.meta.env.VITE_AUTH_GOOGLE_PATH;

const toAbsoluteUrl = (path: string, apiBaseUrl: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("/")) {
    return new URL(path, new URL(apiBaseUrl).origin).toString();
  }

  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
};

export const buildGoogleLoginStartUrl = () => {
  const apiBaseUrl = getApiBaseUrl();
  const configuredPath = getConfiguredGooglePath();

  if (configuredPath) {
    return toAbsoluteUrl(configuredPath, apiBaseUrl);
  }

  return `${apiBaseUrl}/auth/google`;
};
