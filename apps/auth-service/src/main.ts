
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@eshop/error-middleware';
import router from './routes/auth.router';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require("./swagger-output.json");
const app = express();

app.use(cors({
  origin: [process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}))


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



