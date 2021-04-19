import { Router } from 'express';
import userRouter from '../routes/user.route';
import authRouter from '../routes/auth.route';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
