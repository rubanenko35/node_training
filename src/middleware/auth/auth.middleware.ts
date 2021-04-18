import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../config';

class AuthMiddleware {
    private readonly nonSecurePaths: RegExp[] = [new RegExp('/api/auth/sign*')];

    public verifyToken(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const isNonSecurePath = this.isPathNonSecure(request.path);

        if (isNonSecurePath) {
            return next();
        }

        const authHeader = request.get('Authorization');
        if (!authHeader) {
            return response
                .status(401)
                .json({ message: 'Token is not provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        try {
            jwt.verify(token, config.jwtSecret);

            return next();
        } catch {
            return response.status(401).json({ message: 'Invalid token' });
        }
    }

    private isPathNonSecure(requestPath: string): boolean {
        return !!this.nonSecurePaths.some(regexp => requestPath.match(regexp));
    }
}

export const authMiddleware = new AuthMiddleware();
