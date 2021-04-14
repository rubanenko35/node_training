import { database } from '../../../knex/knex';
import { Request, Response } from 'express';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from './types/user.interface';
import config from './../../config';
import { TokenTypeEnum } from './types/token-type.enum';
import * as uuid from 'uuid';
import { IRefreshToken } from './types/refresh-token.interface';

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
            return this.updateTokens(user.id).then(({ accessToken, refreshToken }) => {
                res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly`);

                return  res.json({ token: accessToken });
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials. Wrong "password"' });
        }
    }

    public refreshToken(req: Request, res: Response): Response {
        const refreshHeader = req.get('cookie');
        if (!refreshHeader) {
            return res.status(401).json({ message: 'Refresh token is not provided'});
        }
        const refreshToken = refreshHeader.replace('refreshToken=', '');
        let payload: { id: string; type: TokenTypeEnum }
        try {
            payload = jwt.verify(refreshToken, config.jwtSecret);
            if (payload.type !== TokenTypeEnum.refresh) {
                return res.status(400).json({ message: 'Invalid refresh token type'});
            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ message: 'Refresh token expired'});
            } else {
                return res.status(400).json({ message: 'Invalid refresh token'});
            }
        }

        database('refresh_token').where({ tokenId: payload.id }).first().then((token: IRefreshToken) => {
            if (!token) {
                throw new Error('No token in database');
            }

            return this.updateTokens(token.userId);

        }).then(({ accessToken, refreshToken }) => {
            res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly`);

            return  res.json({ token: accessToken });
        }).catch(err => res.status(500).json({ message: err.message}));
    }

    private updateTokens(userId: number): Promise<{ accessToken: string; refreshToken: string; }> {
        const accessTokenData = this.generateAccessToken(userId);
        const refreshTokenData = this.generateRefreshToken();
        const payload: IRefreshToken = { tokenId: refreshTokenData.tokenId, userId };

        return this.replaceDbRefreshToken(payload).then(() => {
            return {
                accessToken: accessTokenData.token,
                refreshToken: refreshTokenData.token
            }
        })
    }

    private generateAccessToken(userId: number) {
        const payload = { id: userId, type: TokenTypeEnum.access };
        const options = { expiresIn: config.jwtAccessExpiresIn };

        const token = jwt.sign(payload, config.jwtSecret, options);

        return { token, tokenId: payload.id };
    }

    private generateRefreshToken() {
        const payload = { id: uuid.v4(), type: TokenTypeEnum.refresh };
        const options = { expiresIn: config.jwtRefreshExpiresIn };

        const token = jwt.sign(payload, config.jwtSecret, options);

        return { token, tokenId: payload.id };
    }

    private replaceDbRefreshToken(params: { tokenId: string; userId: number }): Promise<any> {
        const table = database('refresh_token');

        return table.where({ userId: params.userId }).first().del().then(() => {
            return table.insert([params]);
        });
    }

}

export const authController = new AuthController();
