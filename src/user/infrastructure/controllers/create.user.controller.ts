import { Request, Response } from "express";
import { UserUseCase } from '../../application/useCases/user.usecase';
import { MysqlRepository } from '../data/mysql.createUser.repository';
import { EncryptHelper } from "../helpers/encrypt.helper";
import { User } from "../../domain/models/user";

const mysqlRepository = new MysqlRepository();
const userAppService = new UserUseCase(mysqlRepository);
const encryptPassword = new EncryptHelper();

export class UserController {
    static async createUser(req: Request, res: Response): Promise<any> {
        try {
            const { email, password, name } = req.body;
            const hashedPassword = encryptPassword.endecodePassword(password);
            
            const newUser = new User( email, hashedPassword, name);

            
            const verify = await userAppService.getUserByEmail(newUser.email);
            if (verify) {
                res.status(400).json({
                    message: 'El usuario ya existe'
                });
                return;
            }

            const result = await userAppService.createUser(newUser);

            if (!result) {
                throw new Error('La creación del usuario no devolvió resultado');
            }

            res.status(201).json({
                message: 'El usuario se creó exitosamente',
                data: {
                    email: newUser.email,
                    username: newUser.username
                }
            });
        } catch (error) {
            console.log('Hubo un error al crear el usuario', error);
            res.status(500).json({
                error: 'Hubo un error al crear el usuario'
            });
        }
    }
}