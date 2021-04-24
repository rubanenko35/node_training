import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../../loaders/application-config';
import { TokenTypeEnum } from '../../controllers/auth/types/token-type.enum';

class AuthMiddleware {
    private readonly nonSecurePaths: RegExp[] = [new RegExp('/api/auth/*')];

    public verifyToken(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const isNonSecurePath = this.isPathNonSecure(request.path);

        if (isNonSecurePath) {
            return next();
        }

        const authHeader = request.get('Authorization') || '';
        const authToken = authHeader.replace('Bearer ', '');

        const refreshHeader = request.get('cookie') || '';
        const refreshToken = refreshHeader.replace('refreshToken=', '');

        if (!authToken || !refreshToken) {
            return response
                .status(401)
                .send(new Error('Token is not provided'));
        }

        try {
            jwt.verify(authToken, config.jwtSecret);
            const refreshTokenPayload: {
                id: string;
                type: TokenTypeEnum;
            } = jwt.verify(refreshToken, config.jwtSecret);

            if (refreshTokenPayload.type !== TokenTypeEnum.refresh) {
                return response
                    .status(401)
                    .send(new Error('Invalid refresh token type'));
            }

            return next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return response
                    .status(401)
                    .send(new Error('Refresh token expired'));
            }
            return response
                .status(401)
                .send(new Error('Invalid refresh token'));
        }
    }

    private isPathNonSecure(requestPath: string): boolean {
        return !!this.nonSecurePaths.some(regexp => requestPath.match(regexp));
    }
}

export const authMiddleware = new AuthMiddleware();
