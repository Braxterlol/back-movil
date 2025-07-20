import { Router } from "express";
import { GetWorldsController } from "../controllers/getWorlds.controller";
import { GetLevelsController } from "../controllers/getLevels.controller";

const router = Router();

router.get('/getWorlds/:language_id', GetWorldsController.getWorlds);
router.get('/getLevels/:world_id', GetLevelsController.getLevels);
router.get('/getLevelContent/:userId/:level_id', GetLevelsController.getLevelContent);
router.get('/checkAnswer/:exercise_id/:option_id', GetLevelsController.checkExerciseAnswer);
router.put('/finishLevel/:userId', GetLevelsController.finishLevel);

export default router;