export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  // outros campos que você realmente usa
}
