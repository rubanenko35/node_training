import { Router, Request, Response } from 'express';
import LoggerInstance from '../../../loaders/logger';
import fs from 'fs';

const route = Router();
const filePath = 'C:\\dev\\node_training\\src\\assets\\user-mocks.json';

export const users = (app: Router) => {
    app.use('/users', route);

    route.get('/getAll', (req: Request, res: Response) => {
        fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
                LoggerInstance.error("File read failed:", err);
                return res.status(400).send({
                    message: 'This is an error!'
                });
            }

            return res.send(jsonString).status(200);
        });
    });

    route.get('/getById/:id', (req: Request, res: Response) => {
        fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
                LoggerInstance.error("File read failed:", err);
                return res.status(400).send({
                    message: 'This is an error!'
                });
            }
            const id = req.params.id;
            const users = JSON.parse(jsonString);
            const user = users.find((user) => user.id === id)

            return res.json(user).status(200);
        });
    });

    route.post('/create', (req: Request, res: Response) => {
        fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
                LoggerInstance.error("File read failed:", err);
                return res.status(400).send({
                    message: 'This is an error!'
                });
            }

            const users = JSON.parse(jsonString);

            fs.writeFile(filePath, JSON.stringify([...users, req.body]), err => {
                if (err) {
                    LoggerInstance.error("File write failed:", err);
                    return res.status(400).send({
                        message: 'This is an error!'
                    });
                }

                return res.json(req.body).status(200);
            });
        });
    });
};



