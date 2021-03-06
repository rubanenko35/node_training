import winston from 'winston';
import config from './application-config';
import 'winston-daily-rotate-file';
import { clsMiddleware } from '../api/middlewares/cls/cls.middleware';

const transports = [];
if (process.env.NODE_ENV !== 'development') {
    transports.push(new winston.transports.Console());
} else {
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: `./logs`,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    );
}

const LoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(info => {
            return `TraceId: ${clsMiddleware.traceId} ${JSON.stringify(info)}`;
        }),
    ),
    transports,
});

export default LoggerInstance;
