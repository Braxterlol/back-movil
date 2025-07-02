import { Request, Response } from "express";
import { UserUseCase } from '../../application/useCases/user.usecase';
import { MysqlRepository } from '../data/mysql.createUser.repository';


const mysqlRepository = new MysqlRepository();
const userAppService = new UserUseCase(mysqlRepository);

export class UserBadgesController {
    static async getUserBadges(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const userBadges = await userAppService.getUserBadges(userId);
        res.status(200).json({
            message: 'Badges del usuario obtenidos exitosamente',
            userBadges: userBadges
        });
    }
}

