import { query } from '../../../db/db.config';
import { User } from '../../domain/models/user';
import { UserRepository } from '../../domain/repositories/user.repository';

export class MysqlRepository implements UserRepository {

    createUser = async (user: User): Promise<any> => {
        const sql = 'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)';
        const params = [user.email, user.passwordHash, user.username];
        try {
            const result = await query(sql, params);
            return result;
        } catch (error) {
            console.log('Error al crear el usuario en MySQL', error);
            throw new Error('Error al crear el usuario en MySQL' + error);
        }
    }

    getUserByEmail = async (email: string): Promise<User | null> => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const params = [email];
        try {
            const result = await query(sql, params);
            
            // Verificar que result no sea null antes de desestructurar
            if (!result) {
                return null;
            }
            
            const [rows, metadata] = result;
            
            // Verificar si hay datos reales
            if (Array.isArray(rows) && rows.length > 0) {
                const userData = rows[0] as any;
                return new User(userData.email, userData.password_hash, userData.username);
            }
            
            return null; // No se encontró usuario
        } catch (error) {
            console.log('Error al buscar el usuario por email');
            throw new Error('Hubo un error al buscar el usuario por email');
        }
    }

    getUserProfile = async (userId: string): Promise<any> => {
        const sql = 'SELECT * FROM user_profiles WHERE user_id = ?';
        const params = [userId];
        try {
            const result = await query(sql, params);
            const rows = result as any[];
            const userProfile = rows[0][0];
            if(!userProfile) {
                throw new Error('Usuario no encontrado');
            }
            return userProfile;
        } catch (error) {
            console.log('Error al buscar el perfil del usuario');
            throw new Error('Hubo un error al buscar el perfil del usuario');
        }
    }
}

