import { User } from '../models/user';

export interface UserRepository {
    createUser(user: User): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    getUserProfile(userId: string): Promise<any>;
};