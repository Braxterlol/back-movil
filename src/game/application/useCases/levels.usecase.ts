import { Level } from "../../domain/models/level.model";
import { LevelsRepository } from "../../domain/repositories/levels.repository";

export class LevelsUseCase {
    constructor(private levelsRepository: LevelsRepository) {}

    async getLevels(world_id: number): Promise<Level[]> {
        return this.levelsRepository.getLevels(world_id);
    }

    async getLevelContent(level_id: number): Promise<any> {
        return this.levelsRepository.getLevelContent(level_id);
    }

    async checkExerciseAnswer(exercise_id: number, option_id: number): Promise<boolean> {
        return this.levelsRepository.checkExerciseAnswer(exercise_id, option_id);
    }

    async finishLevel(userId: number, level_id: number, status: string, score: number): Promise<any> {
        return this.levelsRepository.finishLevel(userId, level_id, status, score);
    }

    async unlockNextLevel(userId: number, level_id: number): Promise<any> {
        return this.levelsRepository.unlockNextLevel(userId, level_id);
    }

}