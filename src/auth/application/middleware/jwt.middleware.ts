import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_JWT } from '../../domain/constant/auth.constant';


declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;   
                email: string;
                iat: number;
                exp: number;
            };
        }
    }
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.status(401).json({ message: 'Token de autenticación no proporcionado' });
        return;
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Formato de token inválido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT) as {
            userId: number;    // Incluir userId en el tipo
            email: string;
            iat: number;
            exp: number;
        };

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token');
        res.status(403).json({ message: 'Token de autenticación inválido' });
    }
}