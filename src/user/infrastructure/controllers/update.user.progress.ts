import { Request, Response } from "express";
import { UserUseCase } from '../../application/useCases/user.usecase';
import { MysqlRepository } from '../data/mysql.createUser.repository';


const mysqlRepository = new MysqlRepository();
const userAppService = new UserUseCase(mysqlRepository);

export class UserProgressUpdateController {
    static async updateUserProgress(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const { levelId, status, score } = req.body;
        const userProgress = await userAppService.updateUserProgress(userId, Number(levelId), status, Number(score));
        res.status(200).json({
            message: 'Progreso del usuario actualizado exitosamente',
            userProgress: userProgress.affectedRows
        });
    }
}