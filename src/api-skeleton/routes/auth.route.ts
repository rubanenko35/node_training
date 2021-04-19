import { Router } from 'express';

const authRouter = Router();

authRouter.route('/login').get();

export default authRouter;