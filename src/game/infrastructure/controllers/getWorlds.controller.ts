import { Request, Response } from "express";
import { WorldsUseCase } from "../../application/useCases/worlds.usecases";
import { MysqlRepository } from "../data/mysql.worlds";

const mysqlRepository = new MysqlRepository();
const worldsUseCase = new WorldsUseCase(mysqlRepository);

export class GetWorldsController {
    static async getWorlds(req: Request, res: Response): Promise<any> {
        const { language_id } = req.body;
        
        try {
            const worlds = await worldsUseCase.getWorld(language_id);
            
            if (!worlds || worlds.length === 0) {
                return res.status(404).json({
                    message: 'No se encontraron mundos para el idioma especificado',
                   
                });
            }
            
            res.status(200).json({
                message: 'Mundos obtenidos exitosamente',
                worlds: worlds
            });
            
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener los mundos',
                error: error
            });
        }
    }
}