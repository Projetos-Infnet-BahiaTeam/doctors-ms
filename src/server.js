import app from './app';

require('dotenv').config();

const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;

app.listen(port, host, () => {
    console.log(`Microsservice started on port ${port}`);
});