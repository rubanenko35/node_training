import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.route('/all').get(userController.getAllUsers);
userRouter.route('/:id').get(userController.getUserById);

export default userRouter;