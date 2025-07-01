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
}