import { Request, Response } from "express";
import { UserUseCase } from '../../application/useCases/user.usecase';
import { MysqlRepository } from '../data/mysql.createUser.repository';


const mysqlRepository = new MysqlRepository();
const userAppService = new UserUseCase(mysqlRepository);

export class UserProgressController {
    static async getUserProgress(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const userProgress = await userAppService.getUserProgress(userId);
        res.status(200).json({
            message: 'Progreso del usuario obtenido exitosamente',
            userProgress: userProgress
        });
    }
}

