import { World } from "../models/worlds.model";

export interface WorldsRepository {
    getWorld(lenguage_id: number): Promise<any>;
}