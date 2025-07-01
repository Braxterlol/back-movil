import express from 'express';
import { UserController } from '../controllers/create.user.controller';
import { UserProfileController } from '../controllers/get.user.profile';

export const router = express.Router();

router.post('/', UserController.createUser);
router.get('/profile/:userId', UserProfileController.getUserProfile);

export default router;