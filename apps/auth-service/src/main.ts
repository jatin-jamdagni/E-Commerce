
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@eshop/error-middleware';
import router from './routes/auth.router';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = require("./swagger-output.json");
 const app = express();


app.use(cors({
  origin: [
    process.env.GATEWAY_API_URL || 'http://localhost:8080',
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    "http://localhost:3000", // Your frontend URL
    "http://127.0.0.1:3000",
    "http://localhost:8080", // Gateway URL
  ],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  optionsSuccessStatus: 200
}));

app.options('*', cors());


app.use(express.json());
app.use(cookieParser())
app.get('/', (req, res) => {
  res.send({ message: 'Hello from auth api' });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/api", router);


app.use(errorMiddleware)

const port = process.env.AUTH_PORT ? Number(process.env.AUTH_PORT) : 6001;

const server = app.listen(port, () => {
  console.log(`[ ready ] - Auth service is runing at: http://localhost:${port}/api`);
  console.log(`[ ready ] - API Docs is runing at: http://localhost:${port}/api-docs`);
});



server.on('error', (err) => {
  console.error('Server error:', err);
}
);



