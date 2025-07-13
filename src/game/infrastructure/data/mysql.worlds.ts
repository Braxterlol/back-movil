import { query } from "../../../db/db.config";  
import { WorldsRepository } from "../../domain/repositories/worlds.repository";
import { World } from "../../domain/models/worlds.model";

export class MysqlRepository implements WorldsRepository {
    getWorld = async (language_id: number): Promise<any> => {
        const sql = 'SELECT * FROM worlds WHERE language_id = ?';
        const params = [language_id];
        try {
            const [worlds] = await query(sql, params) as [any[], any];
            if(!worlds) {
                throw new Error('Mundos no encontrados');
            }
            return worlds;
        } catch (error) {
            console.log('Error al obtener los mundos', error);
            throw new Error('Error al obtener los mundos' + error);
        }
    }
}