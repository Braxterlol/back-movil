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

    getUserProgress =async (userId: string): Promise<any> => {
        const sql = 'SELECT * FROM user_level_progress WHERE user_id = ?';
        const params = [userId];
        try {
            const [userProgress] = await query(sql, params) as [any[], any];
            if(!userProgress) {
                throw new Error('Progreso del usuario no encontrado');
            }
            return userProgress;
        } catch (error) {
            console.log('Error al buscar el progreso del usuario');
            throw new Error('Hubo un error al buscar el progreso del usuario');
        }
    }

    getUserBadges = async (userId: string): Promise<any> => {
        const sql = `
        SELECT b.id, b.name, b.description, b.icon_url, ub.obtained_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        `;

        const params = [userId];
        try {
            const [userBadges] = await query(sql, params) as [any[], any];
            if(!userBadges) {
                throw new Error('Badges del usuario no encontrados');
            }
            return userBadges;
        } catch (error) {
            console.log('Error al buscar los badges del usuario');
            throw new Error('Hubo un error al buscar los badges del usuario');
        }
    }

    updateUserProgress = async (userId: string, levelId: number, status: string, score: number): Promise<any> => {
        const sql = 'UPDATE user_level_progress SET status = ?, best_score = ? WHERE user_id = ? AND level_id = ?';
        const params = [status, score, userId, levelId];
        try {
            const result = await query(sql, params);
            return result;
        } catch (error) {
            console.log('Error al actualizar el progreso del usuario');
            throw new Error('Hubo un error al actualizar el progreso del usuario');
        }
    }
}

