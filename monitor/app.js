import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import client from 'prom-client';
import { v4 as uuidv4 } from 'uuid';


const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

const app = express();
app.use(express.json());


// app.use(pinoHttp({ logger })); 

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
  req.traceId = uuidv4();
  next();
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(duration);

    logger.info({
      traceId: req.traceId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      time: new Date().toISOString(),
      duration: duration
    });
  });

  next();
});

app.get('/hello', (req, res) => {
  res.json('Hello World');
});

// giả lập request chậm
app.get('/slow', async (req, res) => {
  await new Promise(r => setTimeout(r, 2000));
  res.send('slow');
});

app.get('/slowest', async (req, res) => {
  await new Promise(r => setTimeout(r, 10000));
  res.send('slow');
});

// giả lập cpu cao
app.get('/cpu', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  res.send('done');
});

// giả lập Memory leak
let data = [];
app.get('/leak', (req, res) => {
  data.push(new Array(1000000).fill('leak'));
  res.send('leaking...');
});

app.get('/error', (req, res) => {
  throw new Error('Something broke');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use((err, req, res, next) => {
  // req.log.error(err);
  logger.error({
    error: err.message,
    url: req.url,
    method: req.method,
    time: new Date().toISOString()
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3010, () => {
  console.log('Server running on port 3010');
});