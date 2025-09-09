import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use((req, res) => {
  res.status(404).send(`Route ${req.method} ${req.originalUrl} not found`);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).send(err.message || 'Something went wrong');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

