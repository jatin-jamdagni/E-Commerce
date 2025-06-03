/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan'
import rateLimit from 'express-rate-limit';
// import swagerUI from 'swagger-ui-express';
// import axios from 'axios';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors(
  {
    origin: [process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  }
));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({
  limit: "100mb"
}));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: express.Request & { user?: unknown }) => (req.user ? 1000 : 100),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown'
});

app.use(limiter);

app.use('/', proxy(process.env.AUTH_API_URL || 'http://localhost:6001'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/gateway-header', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

const port = process.env.GATEWAY_PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
