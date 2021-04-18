import { Router } from 'express';
import { users } from './routes/user/user';
import { csvRoute } from './routes/user/csv';
import { authRoute } from './routes/auth/auth';

export const routes = (): Router => {
    const app = Router();

    users(app);
    csvRoute(app);
    authRoute(app);

    return app;
};
