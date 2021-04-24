import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../../controllers/auth/auth.controller';

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
const authRouter = Router();

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
authRouter
    .route('/signUp')
    .post(
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        authController.signUp.bind(authController),
    );
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
authRouter
    .route('/signIn')
    .post(
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        authController.signIn.bind(authController),
    );
authRouter
    .route('/refreshToken')
    .get(authController.refreshToken.bind(authController));

export default authRouter;
