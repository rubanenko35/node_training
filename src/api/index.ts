import { Router } from 'express';
import { users } from './routes/user/user';
import { csvRoute } from './routes/user/csv';

export const routes = () => {
    const app = Router();

    users(app);
    csvRoute(app);

    return app
}


