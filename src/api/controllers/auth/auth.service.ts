import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { database } from '../../../../knex/knex';
import { UserInterface } from './types/user.interface';
import config from '../../../loaders/application-config';
import { TokenTypeEnum } from './types/token-type.enum';
import { RefreshTokenInterface } from './types/refresh-token.interface';

export class AuthService {
    public async signUp({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<string> {
        const hashedPassword = await bCrypt.hash(password, 12);
        return database('users_table')
            .insert([{ email, password_hash: hashedPassword }])
            .then(
                () => {
                    return `User has been successfully created`;
                },
                error => {
                    return error;
                },
            );
    }

    public async signIn({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{ accessToken: string; refreshToken: string }> {
        const user: UserInterface = await database('users_table')
            .where({ email })
            .first();

        if (!user) {
            return Promise.reject(
                new Error('Invalid credentials. The "User" is not found'),
            );
        }

        const isValid = await bCrypt.compare(password, user.password_hash);

        if (!isValid) {
            return Promise.reject(
                new Error(
                    `${user.email} Invalid credentials. Wrong "password"`,
                ),
            );
        }

        return this.updateTokens(user.id);
    }

    public refreshToken(
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        if (!refreshToken) {
            return Promise.reject(new Error('Refresh token is not provided'));
        }

        let payload: { id: string; type: TokenTypeEnum };
        try {
            payload = jwt.verify(refreshToken, config.jwtSecret);
            if (payload.type !== TokenTypeEnum.refresh) {
                return Promise.reject(new Error('Invalid refresh token type'));
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return Promise.reject(new Error('Refresh token expired'));
            }
            return Promise.reject(new Error('Invalid refresh token'));
        }

        return database('refresh_token')
            .where({ tokenId: payload.id })
            .first()
            .then((token: RefreshTokenInterface) => {
                if (!token) {
                    return Promise.reject(new Error('No token in database'));
                }

                return this.updateTokens(token.userId);
            });
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

export const authService = new AuthService();
