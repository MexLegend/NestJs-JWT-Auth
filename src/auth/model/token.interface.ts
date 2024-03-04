export interface ITokenPayload {
  sub: string;
  email: string;
}

export interface IRefreshTokenPayload {
  userId: string;
  refreshToken: string;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}
