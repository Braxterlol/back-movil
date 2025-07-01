export interface TokenRepository {
    verifyToken(token: string): void;
}