import { Router, Request, Response } from 'express';
import multer from 'multer';
import csv from 'csvtojson';

const upload = multer({ dest: 'uploads/' });
const route = Router();

export const csvRoute = (app: Router) => {
    app.use('/csv', route);

    route.post(
        '/upload',
        upload.single('usersList'),
        (request: Request | any, response: Response) => {
            csv()
                .fromFile(request.file.path)
                .then(jsonArrayObject =>
                    response.send(jsonArrayObject).status(200),
                );
        },
    );
};
