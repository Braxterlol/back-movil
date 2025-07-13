import { Level } from "../models/level.model";

export interface LevelsRepository {
    getLevels(world_id: number): Promise<Level[]>;
    getLevelContent(level_id: number): Promise<any>;
    checkExerciseAnswer(exercise_id: number, option_id: number): Promise<boolean>;
    finishLevel(userId: number, level_id: number, status: string, score: number): Promise<any>;
    unlockNextLevel(userId: number, level_id: number): Promise<any>;
}