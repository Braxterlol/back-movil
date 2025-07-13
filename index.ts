import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT;

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());

import userRoutes from './src/user/infrastructure/routes/user.routes';
import authRoutes from './src/auth/infrastructure/routes/auth.routes';
import worldsRoutes from './src/game/infrastructure/routes/game.routes';

import { verifyToken } from './src/auth/application/middleware/jwt.middleware';

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/game', verifyToken, worldsRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});