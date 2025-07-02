import express from 'express';
import { UserController } from '../controllers/create.user.controller';
import { UserProfileController } from '../controllers/get.user.profile';
import { UserProgressController } from '../controllers/get.user.progress.controller';
import { UserBadgesController } from '../controllers/get.user.badger.controller';
import { UserProgressUpdateController } from '../controllers/update.user.progress';

export const router = express.Router();

router.post('/', UserController.createUser);
router.get('/profile/:userId', UserProfileController.getUserProfile);
router.get('/progress/:userId', UserProgressController.getUserProgress);
router.get('/badges/:userId', UserBadgesController.getUserBadges);
router.put('/progressUpdate/:userId', UserProgressUpdateController.updateUserProgress);

export default router;