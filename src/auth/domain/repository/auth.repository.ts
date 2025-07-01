export interface AuthUser {
    getUserByEmail(email: string): Promise<any>;
}