import express from 'express';

const app = express();
const port = 3000;

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
