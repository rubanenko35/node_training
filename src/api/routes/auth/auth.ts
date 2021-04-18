import { Router } from 'express';
import { authController } from '../../../controllers/auth/auth.controller';

const route = Router();

export const authRoute = (app: Router) => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       required:
     *          - email
     *          - password
     *       properties:
     *          email:
     *            type: string
     *            description: mail field description
     *          password:
     *            type: string
     *            description: password field description
     *       example:
     *            email: rubanenko35@gmail.com
     *            password: password_1
     *
     *
     *
     */
    app.use('/auth', route);

    /**
     * @swagger
     * /api/auth/signUp:
     *   post:
     *     summary: Create a new book
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: The user was successfully added
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error
     */
    route.post('/signUp', authController.signUp).bind(authController);

    /**
     * @swagger
     * /api/auth/signIn:
     *   post:
     *     summary: Login a user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: The user was successfully logged in
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error
     */
    route.post('/signIn', authController.signIn.bind(authController));

    route.get(
        '/refreshToken',
        authController.refreshToken.bind(authController),
    );
};
