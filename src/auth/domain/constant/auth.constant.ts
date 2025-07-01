import dotenv from 'dotenv';

dotenv.config();

export const SECRET_JWT = process.env.JWTSECRET || 'secret';