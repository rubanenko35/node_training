import { database } from '../../../knex/knex';
import { Request, Response } from 'express';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from './types/user.interface';

class AuthController {
    public async signUp(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(401).send(`"Email" and "Password" are required`);
        }

        const hashedPassword = await bCrypt.hash(password, 12);
        return database('users_table').insert([{email, password_hash: hashedPassword}]).then((data) => {
            return res.json(`User has been successfully created`);
        }, (error) => {
            return res.status(401).json(error);
        });
    }

    public async signIn(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(401).json({ message: `"Email" and "Password" are required` });
        }

        const user: IUser = await database('users_table').where({ email }).first();

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. The "User" is not found' });
        }

        const isValid = await bCrypt.compare(password, user.password_hash);

        if (isValid) {
            const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET);
            return  res.json({ token });
        } else {
            return res.status(401).json({ message: 'Invalid credentials. Wrong "password"' });
        }
    }
}

export const authController = new AuthController();
