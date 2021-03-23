import { Router } from 'express';
import { users } from './routes/user/user';

export const routes = () => {
    const app = Router();

    users(app);

    return app
}


