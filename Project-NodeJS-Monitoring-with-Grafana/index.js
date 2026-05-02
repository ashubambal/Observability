const express = require('express');
const responseTime = require('response-time');
const client = require('prom-client');
const { doSomeHeavyTask } = require('./util');

const app = express();
const port = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register, timeout: 5000 });

const reqResTime = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [10, 50, 100, 200, 500, 700, 1000, 2000] // Define buckets for response time in seconds
});

const totalRequests = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
});

const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
        labels: { job: "nodejs-logger" },
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);

app.use(responseTime((req, res, time) => {
    totalRequests.inc();
        reqResTime.labels({
            method: req.method,
            route: req.route ? req.route.path : 'unknown',
            status_code: res.statusCode
        }).observe(time / 1000);
}));

app.get('/', (req, res) => {
    logger.info('Received request for / endpoint');
    return res.json({ message: 'Hello from Express Server!' });
});

app.get('/slow', async (req, res) => {
    logger.info('Received request for /slow endpoint');
    try {
        const timeTaken = await doSomeHeavyTask();
        logger.info(`Heavy task completed in ${timeTaken} ms`);
        return res.json({ 
            status: 'Success',
            message: `Heavy task completed in ${timeTaken} ms` 
        });
    } catch (error) {
        logger.error(`Error occurred while processing /slow endpoint: ${error.message}`);
        return res.status(500).json({ status: 'Error', message: 'Error occurred while processing the request' });
    }
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port http://0.0.0.0:${port}`);
});
