const express = require('express');
const { doSomeHeavyTask } = require('./util');

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    return res.json({ message: 'Hello from Express Server!' });
});

app.get('/slow', async (req, res) => {
    try {
        const timeTaken = await doSomeHeavyTask();
        return res.json({ 
            status: 'Success',
            message: `Heavy task completed in ${timeTaken} ms` 
        });
    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Error occurred while processing the request' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});