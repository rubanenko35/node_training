import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setup, serve } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './application-config';
import { authMiddleware } from '../api/middlewares/auth/auth.middleware';
import { clsMiddleware } from '../api/middlewares/cls/cls.middleware';
import swaggerOptions from './swagger-optiona';
import router from '../api/routes';

export const expressLoader = ({ app }: { app: express.Application }): void => {
    const specs = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', serve, setup(specs));

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch cls
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());

    app.use(
        clsMiddleware.setTraceId.bind(clsMiddleware),
        authMiddleware.verifyToken.bind(authMiddleware),
    );
    // Load API routes
    app.use(config.api.prefix, router);

    /// catch 404 and forward to error handler
    app.use((request, response, next) => {
        const error = new Error('Not Found');
        next(error);
    });

    /// error handlers
    app.use((error, request, response, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (error.name === 'UnauthorizedError') {
            return response
                .status(error.status)
                .send({ message: error.message })
                .end();
        }
        return next(error);
    });
    app.use((error, request, response, next) => {
        response.status(error.status || 500);
        response.json({
            errors: {
                message: error.message,
            },
        });
    });
};
