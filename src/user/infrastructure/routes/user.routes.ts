import express from 'express';
import { UserController } from '../controllers/create.user.controller';
import { UserProfileController } from '../controllers/get.user.profile';
import { UserProgressController } from '../controllers/get.user.progress.controller';
import { UserBadgesController } from '../controllers/get.user.badger.controller';
import { UserProgressUpdateController } from '../controllers/update.user.progress';

import { verifyToken } from '../../../auth/application/middleware/jwt.middleware';
export const router = express.Router();

router.post('/', UserController.createUser);
router.get('/profile/:userId', verifyToken, UserProfileController.getUserProfile);
router.get('/progress/:userId', verifyToken, UserProgressController.getUserProgress);
router.get('/badges/:userId', verifyToken, UserBadgesController.getUserBadges);
router.put('/progressUpdate/:userId', verifyToken, UserProgressUpdateController.updateUserProgress);

export default router;