import { query } from "../../../db/db.config";
import { LevelsRepository } from "../../domain/repositories/levels.repository";

export class MysqlRepository implements LevelsRepository {
    getLevels = async (world_id: number): Promise<any> => {
        const sql = 'SELECT * FROM levels WHERE world_id = ?';
        const params = [world_id];
        try {
            const [levels] = await query(sql, params) as [any[], any];
            if(!levels) {
                throw new Error('Niveles no encontrados');
            }
            return levels;
        } catch (error) {
            console.log('Error al obtener los niveles', error);
            throw new Error('Error al obtener los niveles' + error);
        }
    }

    async getLevelContent(levelId: number): Promise<any> {
        try {
            // Consulta principal para obtener todos los datos relacionados
            const sql = `
                SELECT 
                    l.id as level_id,
                    l.name as level_name,
                    l.sort_order as level_order,
                    
                    e.id as exercise_id,
                    e.exercise_type,
                    e.question_or_instruction,
                    
                    eo.id as option_id,
                    eo.is_correct,
                    
                    v.id as vocabulary_id,
                    v.language_id,
                    v.native_word,
                    v.foreign_word,
                    v.image_url
                    
                FROM levels l
                LEFT JOIN exercises e ON l.id = e.level_id
                LEFT JOIN exercise_options eo ON e.id = eo.exercise_id
                LEFT JOIN vocabulary v ON eo.vocabulary_id = v.id
                
                WHERE l.id = ?
                ORDER BY e.id, eo.id
            `;
            
            const [rows] = await query(sql, [levelId]);
            
            // Estructurar los datos de forma jerárquica
            const levelContent = this.structureLevelContent(rows as any[]);
            
            return levelContent;
            
        } catch (error) {
            console.error('Error al obtener contenido del nivel:', error);
            throw new Error('Error al obtener contenido del nivel: ' + error);
        }
    }
    
    // Método auxiliar para estructurar los datos
    private structureLevelContent(rows: any[]): any {
        if (rows.length === 0) {
            return null;
        }
        
        const level = {
            level_id: rows[0].level_id,
            level_name: rows[0].level_name,
            level_description: rows[0].level_description,
            level_order: rows[0].level_order,
            exercises: [] as any[]
        };
        
        // Agrupar por ejercicios
        const exercisesMap = new Map();
        
        rows.forEach(row => {
            if (!row.exercise_id) return; // Skip if no exercise
            
            // Si el ejercicio no existe, crearlo
            if (!exercisesMap.has(row.exercise_id)) {
                exercisesMap.set(row.exercise_id, {
                    exercise_id: row.exercise_id,
                    exercise_type: row.exercise_type,
                    question_or_instruction: row.question_or_instruction,
                    options: []
                });
            }
            
            // Agregar la opción al ejercicio
            if (row.option_id) {
                exercisesMap.get(row.exercise_id).options.push({
                    option_id: row.option_id,
                    is_correct: row.is_correct,
                    vocabulary: {
                        vocabulary_id: row.vocabulary_id,
                        language_id: row.language_id,
                        native_word: row.native_word,
                        foreign_word: row.foreign_word,
                        image_url: row.image_url
                    }
                });
            }
        });
        
        // Convertir el Map a array
        level.exercises = Array.from(exercisesMap.values());
        
        return level;
    }

    async checkExerciseAnswer(exerciseId: number, optionId: number): Promise<boolean> {
        const sql = `
            SELECT eo.is_correct 
            FROM exercise_options eo 
            WHERE eo.exercise_id = ? AND eo.id = ?
        `;
        const params = [exerciseId, optionId];
        
        try {
            const [result] = await query(sql, params) as [any[], any];
            
            if (!result || result.length === 0) {
                throw new Error('Opción no encontrada');
            }
            
            return result[0].is_correct === 1;
        } catch (error) {
            console.error('Error al verificar respuesta:', error);
            throw new Error('Error al verificar respuesta: ' + error);
        }
        }

    async finishLevel(userId: number, level_id: number, status: string, score: number): Promise<any> {
        const sql = 'UPDATE user_level_progress SET status = ?, best_score = ?, completed_at = NOW() WHERE user_id = ? AND level_id = ?';
        const params = [status, score, userId, level_id];
        try{
            const [result] = await query(sql, params) as [any[], any];
            return result;
        }catch(error){
            console.error('Error al finalizar el nivel:', error);
            throw new Error('Error al finalizar el nivel: ' + error);
        }
    }

    async unlockNextLevel(userId: number, level_id: number): Promise<any> {
        const sql = 'UPDATE user_level_progress SET status = ?, best_score = ?, completed_at = NOW() WHERE user_id = ? AND level_id = ?';
        const score = 0;
        const status = 'unlocked';
        const params = [status, score, userId, level_id + 1];
        try{
            const [result] = await query(sql, params) as [any[], any];
            return result;
        }catch(error){
            console.error('Error al desbloquear el nivel:', error);
            throw new Error('Error al desbloquear el nivel: ' + error);
        }
    }

}