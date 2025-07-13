import { Router } from "express";
import { GetWorldsController } from "../controllers/getWorlds.controller";
import { GetLevelsController } from "../controllers/getLevels.controller";

const router = Router();

router.get('/getWorlds', GetWorldsController.getWorlds);
router.get('/getLevels', GetLevelsController.getLevels);
router.get('/getLevelContent/:userId', GetLevelsController.getLevelContent);
router.get('/checkAnswer', GetLevelsController.checkExerciseAnswer);
router.put('/finishLevel/:userId', GetLevelsController.finishLevel);

export default router;