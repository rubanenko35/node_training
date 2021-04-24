import { Request, Response, NextFunction } from 'express';
import * as uuid from 'uuid';
import { createNamespace } from 'cls-hooked';
import config from '../../../loaders/application-config';

class ClsMiddleware {
    private clsNamespace: any;

    constructor() {
        this.clsNamespace = createNamespace(config.logs.level);
    }

    get traceId(): string {
        return this.clsNamespace.get('traceId') || 'empty';
    }

    public setTraceId(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        this.clsNamespace.bind(request);
        this.clsNamespace.bind(response);

        this.clsNamespace.run(() => {
            this.clsNamespace.set('traceId', this.generateTraceId());

            next();
        });
    }

    private generateTraceId(): string {
        return uuid.v4();
    }
}

export const clsMiddleware = new ClsMiddleware();
