import { Request, Response } from 'express';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { validationResult } from 'express-validator';
import { database } from '../../../knex/knex';
import { UserInterface } from './types/user.interface';
import config from '../../config';
import { TokenTypeEnum } from './types/token-type.enum';
import { RefreshTokenInterface } from './types/refresh-token.interface';
import LoggerInstance from '../../loaders/logger';

class AuthController {
    public async signUp(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(401)
                .send(`"Email" and "Password" are required`);
        }

        const { email, password } = request.body;
        const hashedPassword = await bCrypt.hash(password, 12);
        return database('users_table')
            .insert([{ email, password_hash: hashedPassword }])
            .then(
                data => {
                    return response.json(`User has been successfully created`);
                },
                error => {
                    return response.status(401).json(error);
                },
            );
    }

    public async signIn(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;
        if (!email || !password) {
            return response
                .status(401)
                .json({ message: `"Email" and "Password" are required` });
        }

        const user: UserInterface = await database('users_table')
            .where({ email })
            .first();

        if (!user) {
            return response.status(401).json({
                message: 'Invalid credentials. The "User" is not found',
            });
        }

        const isValid = await bCrypt.compare(password, user.password_hash);

        if (isValid) {
            LoggerInstance.info(`${user.email} singed in`);
            return this.updateTokens(user.id).then(
                ({ accessToken, refreshToken }) => {
                    response.setHeader(
                        'Set-Cookie',
                        `refreshToken=${refreshToken}; HttpOnly`,
                    );

                    return response.json({ token: accessToken });
                },
            );
        }

        LoggerInstance.error(
            `${user.email} Invalid credentials. Wrong "password"`,
        );
        return response
            .status(401)
            .json({ message: 'Invalid credentials. Wrong "password"' });
    }

    public refreshToken(request: Request, response: Response): Response {
        const refreshHeader = request.get('cookie');
        if (!refreshHeader) {
            return response
                .status(401)
                .json({ message: 'Refresh token is not provided' });
        }
        const refreshToken = refreshHeader.replace('refreshToken=', '');
        let payload: { id: string; type: TokenTypeEnum };
        try {
            payload = jwt.verify(refreshToken, config.jwtSecret);
            if (payload.type !== TokenTypeEnum.refresh) {
                return response
                    .status(400)
                    .json({ message: 'Invalid refresh token type' });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return response
                    .status(400)
                    .json({ message: 'Refresh token expired' });
            }
            return response
                .status(400)
                .json({ message: 'Invalid refresh token' });
        }

        database('refresh_token')
            .where({ tokenId: payload.id })
            .first()
            .then((token: RefreshTokenInterface) => {
                if (!token) {
                    throw new Error('No token in database');
                }

                return this.updateTokens(token.userId);
            })
            .then(({ accessToken, refreshToken }) => {
                response.setHeader(
                    'Set-Cookie',
                    `refreshToken=${refreshToken}; HttpOnly`,
                );

                return response.json({ token: accessToken });
            })
            .catch(error =>
                response.status(500).json({ message: error.message }),
            );
    }

    private updateTokens(
        userId: number,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const accessTokenData = this.generateAccessToken(userId);
        const refreshTokenData = this.generateRefreshToken();
        const payload: RefreshTokenInterface = {
            tokenId: refreshTokenData.tokenId,
            userId,
        };

        return this.replaceDbRefreshToken(payload).then(() => {
            return {
                accessToken: accessTokenData.token,
                refreshToken: refreshTokenData.token,
            };
        });
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

    private replaceDbRefreshToken(parameters: {
        tokenId: string;
        userId: number;
    }): Promise<any> {
        const table = database('refresh_token');

        return table
            .where({ userId: parameters.userId })
            .first()
            .del()
            .then(() => {
                return table.insert([parameters]);
            });
    }
}

export const authController = new AuthController();
