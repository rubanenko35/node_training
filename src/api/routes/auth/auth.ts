import { Router } from 'express';
import { authController } from '../../../controllers/auth/auth.controller';

const route = Router();

export const authRoute = (app: Router) => {
    app.use('/auth', route);

    /**
     * @param {string} email
     * @param {string} password
     */
    route.post('/signUp', authController.signUp).bind(authController);

    /**
     * @param {string} email
     * @param {string} password
     */
    route.post('/signIn', authController.signIn.bind(authController));

    route.get(
        '/refreshToken',
        authController.refreshToken.bind(authController),
    );
};
