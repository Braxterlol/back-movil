import { User } from '../models/user';

export interface UserRepository {
    createUser(user: User): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    getUserProfile(userId: string): Promise<any>;
    getUserProgress(userId: string): Promise<any>;
    getUserBadges(userId: string): Promise<any>;
    updateUserProgress(userId: string, levelId: number, status: string, score: number): Promise<any>;
};