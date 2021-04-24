import { Router, Request, Response } from 'express';
import fs from 'fs';
import LoggerInstance from '../../../loaders/logger';

const route = Router();
const filePath = 'C:\\dev\\node_training\\src\\assets\\user-mocks.json';

export const users = (app: Router) => {
    app.use('/users', route);

    /**
     * @swagger
     * /api/users/getAll:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Get all users
     *     tags:
     *       - User
     *     responses:
     *       200:
     *         description: Return all users
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: Users was not found
     */
    route.get('/getAll', (request: Request, response: Response) => {
        fs.readFile(filePath, 'utf8', (error, jsonString) => {
            if (error) {
                LoggerInstance.error('File read failed:', error);
                return response.status(400).send({
                    message: 'This is an error!',
                });
            }

            return response.send(jsonString).status(200);
        });
    });

    route.get('/getById/:id', (request: Request, response: Response) => {
        fs.readFile(filePath, 'utf8', (error, jsonString) => {
            if (error) {
                LoggerInstance.error('File read failed:', error);
                return response.status(400).send({
                    message: 'This is an error!',
                });
            }
            const { id } = request.params;
            const users = JSON.parse(jsonString);
            const user = users.find(user => user.id === id);

            return response.json(user).status(200);
        });
    });

    route.post('/create', (request: Request, response: Response) => {
        fs.readFile(filePath, 'utf8', (error, jsonString) => {
            if (error) {
                LoggerInstance.error('File read failed:', error);
                return response.status(400).send({
                    message: 'This is an error!',
                });
            }

            const users = JSON.parse(jsonString);

            fs.writeFile(
                filePath,
                JSON.stringify([...users, request.body]),
                error_ => {
                    if (error_) {
                        LoggerInstance.error('File write failed:', error_);
                        return response.status(400).send({
                            message: 'This is an error!',
                        });
                    }

                    return response.json(request.body).status(200);
                },
            );
        });
    });
};
