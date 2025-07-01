import { query } from "../../../db/db.config";
import { AuthUser } from "../../domain/repository/auth.repository";

export class MysqlRepository implements AuthUser {
    getUserByEmail = async (email: string): Promise<any> => {
        // Incluir id en la consulta SELECT
        const sql = 'SELECT id, username, password_hash FROM users WHERE email = ?';
        const params: any[] = [email];
        
        try {
            const result: any = await query(sql, params);
            
            if (!result) {
                return null;
            }
            
            // Procesar el resultado para retornar solo los datos del usuario
            const [rows] = result;
            
            if (Array.isArray(rows) && rows.length > 0) {
                return rows[0]; // Retornar directamente el primer usuario
            }
            
            return null;
        } catch (error) {
            console.log('Hubo un error al buscar el usuario', error);
            throw error;
        }
    }
}