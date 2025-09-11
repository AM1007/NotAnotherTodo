import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import { notFound, errorHandler } from './middleware/errorHandler';
import { connectDb } from './db/sequelize';
import { initializeModels, setupAssociations } from './db/associations';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/ping', (_, res) => res.send('pong'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    console.log('🚀 Starting server...');
    
    await initializeModels();
    
    setupAssociations();
    
    await connectDb();
    
    app.listen(PORT, () => {
      console.log(` Server started at http://localhost:${PORT}`);
      console.log(` Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error(' Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;

