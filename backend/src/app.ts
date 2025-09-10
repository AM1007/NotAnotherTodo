import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { notFound, errorHandler } from './middleware/errorHandler';
import { connectDb } from './db/sequalize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (_, res) => res.send('pong'));

// TODO: api routes
// app.use('/api/auth', authRouter);
// app.use('/api/todos', todoRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
  }
};

start();

export default app;
