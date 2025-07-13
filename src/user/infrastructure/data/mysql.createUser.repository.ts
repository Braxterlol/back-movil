import { query, pool } from '../../../db/db.config';
import { User } from '../../domain/models/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import mysql from 'mysql2/promise';

export class MysqlRepository implements UserRepository {

    createUser = async (user: User): Promise<any> => {
        const connection = await pool.getConnection();
        
        try {
            // Iniciar transacción
            await connection.beginTransaction();
            
            // Crear usuario
            const sql = 'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)';
            const params = [user.email, user.passwordHash, user.username];
            
            const [result] = await connection.execute(sql, params);
            const resultSetHeader = result as any;
            const userId = resultSetHeader.insertId;
            
            // Inicializar progreso del usuario
            await this.initializeUserProgress(userId, connection);
            
            // Confirmar transacción
            await connection.commit();
            
            return result;
        } catch (error) {
            // Revertir transacción en caso de error
            await connection.rollback();
            console.log('Error al crear el usuario en MySQL', error);
            throw new Error('Error al crear el usuario en MySQL: ' + error);
        } finally {
            // Cerrar conexión
            connection.release();
        }
    }
    
    initializeUserProgress = async (userId: number, connection: mysql.PoolConnection): Promise<void> => {
        try {
            // Obtener todos los niveles ordenados por mundo y orden
            const sqlLevels = `
                SELECT l.id as level_id, l.sort_order, w.sort_order as world_order
                FROM levels l 
                JOIN worlds w ON l.world_id = w.id 
                WHERE w.language_id = 1
                ORDER BY w.sort_order ASC, l.sort_order ASC
            `;
            const [levels] = await connection.execute(sqlLevels, []);
            
            if ((levels as any[]).length === 0) {
                console.log('No hay niveles disponibles para inicializar progreso');
                return;
            }
            
            // Preparar SQL para progreso de niveles
            const sqlProgress = `
                INSERT INTO user_level_progress 
                (user_id, level_id, status, best_score) 
                VALUES (?, ?, ?, ?)
            `;
            
            // Crear progreso para cada nivel
            const progressPromises = (levels as any[]).map((level: any, index: number) => {
                const isFirstLevel = index === 0;
                return connection.execute(sqlProgress, [
                    userId,
                    level.level_id,
                    isFirstLevel ? 'unlocked' : 'locked',
                    0, // best_score inicial
                ]);
            });
    
            // Ejecutar todas las inserciones de progreso
            await Promise.all(progressPromises);
    
            // Crear perfil de usuario
            const sqlProfile = `
                INSERT INTO user_profiles (user_id, learning_language_id, difficulty_level, total_points, game_time_seconds)
                VALUES (?, ?, ?, ?, ?)
            `;
            const paramsProfile = [userId, 1, 'basic', 0, 0];
            
            await connection.execute(sqlProfile, paramsProfile);
            
            console.log(`Progreso inicializado para usuario ${userId}: ${(levels as any[]).length} niveles`);
            
        } catch (error) {
            console.log('Error al inicializar progreso del usuario:', error);
            throw new Error('Error al inicializar progreso del usuario: ' + error);
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

