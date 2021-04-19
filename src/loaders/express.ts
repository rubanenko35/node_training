import express from 'express';
import bodyParser from 'body-parser';
import config from '../config';
// import { routes } from '../api';
import routes from '../api-skeleton/routes';
import { authMiddleware } from '../middleware/auth/auth.middleware';

export const expressLoader = ({ app }: { app: express.Application }) => {
  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // app.use(authMiddleware.verifyToken.bind(authMiddleware));
  // Load API routes
  app.use(config.api.prefix, routes);

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
