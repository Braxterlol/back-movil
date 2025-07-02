import {User} from "../../domain/models/user"
import {UserRepository} from "../../domain/repositories/user.repository"

export class UserUseCase {
    constructor(private userRepository: UserRepository) {}

    async createUser(user: User): Promise<any> {
        return await this.userRepository.createUser(user);
    }

    async getUserByEmail(email: string): Promise<any> {
        return await this.userRepository.getUserByEmail(email);
    }

    async getUserProfile(userId: string): Promise<any> {
        return await this.userRepository.getUserProfile(userId);
    }

    async getUserProgress(userId: string): Promise<any> {
        return await this.userRepository.getUserProgress(userId);
    }

    async getUserBadges(userId: string): Promise<any> {
        return await this.userRepository.getUserBadges(userId);
    }

    async updateUserProgress(userId: string, levelId: number, status: string, score: number): Promise<any> {
        return await this.userRepository.updateUserProgress(userId, levelId, status, score);
    }

}