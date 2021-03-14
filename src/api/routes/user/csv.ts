import { Router, Request, Response } from 'express';
import multer from 'multer';
import csv from 'csvtojson'

const upload = multer({ dest: 'uploads/' });
const route = Router();

export const csvRoute = (app: Router) => {
    app.use('/csv', route);

    route.post('/upload', upload.single('usersList'), (req: Request | any, res: Response) => {
        csv().fromFile(req.file.path).then(jsonArrayObj => {
            return res.send(jsonArrayObj).status(200);
        })
    });
};



