import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import LoggerInstance from '../../../loaders/logger';
import { authService } from './auth.service';

class AuthController {
    public async signUp(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(401)
                .send(new Error(`"Email" and "Password" are required`));
        }

        const { email, password } = request.body;

        try {
            const data = await authService.signUp({ email, password });
            LoggerInstance.info(data);

            return response.send(data);
        } catch (error) {
            LoggerInstance.error(error);

            return response.status(401).send(error);
        }
    }

    public async signIn(
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

        try {
            const data = await authService.signIn({ email, password });
            LoggerInstance.info(data);

            response.setHeader(
                'Set-Cookie',
                `refreshToken=${data.refreshToken}; HttpOnly`,
            );

            return response.send({ token: data.accessToken });
        } catch (error) {
            LoggerInstance.error(error);

            return response.status(401).send(error);
        }
    }

    public refreshToken(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const refreshHeader = request.get('cookie') || '';
        const refreshToken = refreshHeader.replace('refreshToken=', '');

        return authService
            .refreshToken(refreshToken)
            .then(({ accessToken, refreshToken }) => {
                LoggerInstance.info({ accessToken, refreshToken });

                response.setHeader(
                    'Set-Cookie',
                    `refreshToken=${refreshToken}; HttpOnly`,
                );

                return response.send({ token: accessToken });
            })
            .catch(error => {
                LoggerInstance.error(error);

                return response.status(401).send(error);
            });
    }
}

export const authController = new AuthController();
