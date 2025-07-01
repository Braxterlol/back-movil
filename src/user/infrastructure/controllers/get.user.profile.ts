import { Request, Response } from "express";
import { UserUseCase } from '../../application/useCases/user.usecase';
import { MysqlRepository } from '../data/mysql.createUser.repository';
import { User } from "../../domain/models/user";


const mysqlRepository = new MysqlRepository();
const userAppService = new UserUseCase(mysqlRepository);

export class UserProfileController {
    static async getUserProfile(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const userProfile = await userAppService.getUserProfile(userId);
        res.status(200).json({
            message: 'Perfil del usuario obtenido exitosamente',
            userProfile: userProfile
        });
    }
}

