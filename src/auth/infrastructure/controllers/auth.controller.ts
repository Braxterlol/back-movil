import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { MysqlRepository } from '../data/mysql.auth.repository';
import { AuthRequest } from '../../domain/model/auth.model';
import bcrypt from 'bcrypt';
import { SECRET_JWT } from '../../domain/constant/auth.constant';

export class AuthController {
    private static mysqlRepository = new MysqlRepository(); 

    static login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' });
            return;
        }

        try {
            const userData = await AuthController.mysqlRepository.getUserByEmail(email);

            if (!userData) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }

            // Ahora userData contiene: { id, email, password_hash }
            const passwordMatch = await bcrypt.compare(password, userData.password_hash);

            if (!passwordMatch) {
                res.status(401).json({ message: 'Contraseña incorrecta' });
                return;
            }

            const token = jwt.sign(
                { 
                    userId: userData.id,      
                    email: userData.email,
                }, 
                SECRET_JWT, 
                { expiresIn: '1h' }
            );

            res.status(200).json({ 
                message: 'El acceso fue correcto',
                token,
                user: {
                    id: userData.id,           // ID disponible en la respuesta
                    username: userData.username
                    // NO incluir password_hash por seguridad
                }
            });

        } catch (error) {
            console.error('Error en la autenticación');
            res.status(500).json({ message: 'Error en la autenticación' });
        }
    }
}