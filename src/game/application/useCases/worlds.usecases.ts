import { WorldsRepository } from "../../domain/repositories/worlds.repository";
import { World } from "../../domain/models/worlds.model";

export class WorldsUseCase {
    constructor(private worldsRepository: WorldsRepository) {}

    async getWorld(language_id: number): Promise<any> {
        return this.worldsRepository.getWorld(language_id);
    }
}