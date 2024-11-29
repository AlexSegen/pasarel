import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    isDev: process.env.NODE_ENV === 'MOCKS',
};
