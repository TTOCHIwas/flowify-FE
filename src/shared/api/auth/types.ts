export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
