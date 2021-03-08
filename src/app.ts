import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Server start message!');
});

// @ts-ignore
app.listen(port, err => {
    if (err) {
        throw new Error(`Server error: ${err}`);
    }

    return console.log(`Server listening on port: ${port}`);
});
