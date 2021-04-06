import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';


class AuthMiddleware {
    private readonly nonSecurePaths: RegExp[] = [new RegExp('/api/auth/*')];

    public verifyToken(req: Request, res: Response, next: NextFunction) {
        const isNonSecurePath = this.isPathNonSecure(req.path);

        if(isNonSecurePath) {
            return next();
        }

        const authHeader = req.get('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Token is not provided'});
        }

        const token = authHeader.replace('Bearer ', '');
        try {
            jwt.verify(token, process.env.JWT_SECRET);

            return next();
        } catch (e) {
            return res.status(401).json({ message: 'Invelid token' });
        }

    }

    private isPathNonSecure(requestPath: string): boolean {
        return !!this.nonSecurePaths.find(regexp => requestPath.match(regexp));
    }
}

export const authMiddleware = new AuthMiddleware();
