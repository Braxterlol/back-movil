import { Request, Response } from "express";
import { LevelsUseCase } from "../../application/useCases/levels.usecase";
import { MysqlRepository } from "../data/mysql.levels";
import { MysqlRepository as UserMysqlRepository } from "../../../user/infrastructure/data/mysql.createUser.repository";
import { UserUseCase } from "../../../user/application/useCases/user.usecase";
import { User } from "../../../user/domain/models/user";

const mysqlRepository = new MysqlRepository();
const levelsUseCase = new LevelsUseCase(mysqlRepository);
const userMysqlRepository = new UserMysqlRepository();
const userUseCase = new UserUseCase(userMysqlRepository);

export class GetLevelsController {
    static async getLevels(req: Request, res: Response): Promise<any> {
        const { world_id } = req.params;
        const levels = await levelsUseCase.getLevels(Number(world_id));
        res.status(200).json(levels);
    }

    static async getLevelContent(req: Request, res: Response): Promise<any> {
        const { userId, level_id } = req.params;
        try {
            const userProgress = await userUseCase.getUserProgress(userId); 
            const hasAccess = userProgress && userProgress.some((progress: any) => 
                progress.level_id === Number(level_id) && 
                (progress.status === 'unlocked' || progress.status === 'completed')
            );
            
            if (!hasAccess) {
                return res.status(403).json({ message: 'No tienes acceso a este nivel' });
            }
            
            const levelContent = await levelsUseCase.getLevelContent(Number(level_id));
            
            res.status(200).json({
                success: true,
                data: levelContent
            });
            
        } catch (error) {
            console.log('Error al obtener el contenido del nivel', error);
            res.status(500).json({
                error: 'Error al obtener el contenido del nivel'
            });
        }

    }

    static async checkExerciseAnswer(req: Request, res: Response): Promise<any> {
        const { exercise_id, option_id } = req.params;
        try{
            const answer = await levelsUseCase.checkExerciseAnswer(Number(exercise_id), Number(option_id));
            let score = 0;
            let message = "";

            if(answer){
                score = 100;
                message = "Felicidades, has respondido correctamente y obtuviste " + score + " puntos";
            }else{
                score = -10;
                message = "Lo siento, has respondido incorrectamente y has perdido " + score + " puntos";
                
            }
            res.status(200).json({
                success: true,
                data: {
                    message: message,
                    score: score,
                    isCorrect: answer
                }
            });
        } catch (error) {
            console.log('Error al verificar la respuesta del ejercicio', error);
            res.status(500).json({
                error: 'Error al verificar la respuesta del ejercicio'
            });
        }
    }


    static async finishLevel(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const { level_id, status, score } = req.body;
        try{
            const result = await levelsUseCase.finishLevel(Number(userId), Number(level_id), status, Number(score));
            const nextLevel = await levelsUseCase.unlockNextLevel(Number(userId), Number(level_id));
            res.status(200).json({
                success: true,
                data: {
                    message: 'Nivel finalizado correctamente',
                    result: result,
                    nextLevel: nextLevel
                }
            });
        }catch(error){
            console.log('Error al finalizar el nivel', error);
            res.status(500).json({
                error: 'Error al finalizar el nivel'
            });
        }
    }

    // static async unlockNextLevel(req: Request, res: Response): Promise<any> {
    //     const { userId } = req.params;
    //     const { level_id } = req.body;
    //     try{
    //         const result = await levelsUseCase.unlockNextLevel(Number(userId), Number(level_id));
    //         res.status(200).json({
    //             success: true,
    //             data: {
    //                 message: 'Nivel desbloqueado correctamente',
    //                 result: result
    //             }
    //         });
    //     }catch(error){
    //         console.log('Error al desbloquear el nivel', error);
    //         res.status(500).json({
    //             error: 'Error al desbloquear el nivel'
    //         });
    //     }
    // }
}