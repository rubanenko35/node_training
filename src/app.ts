import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Server start message!');
});


app.listen(port, () => {
    return console.log(`Server listening on port: ${port}`);
});
