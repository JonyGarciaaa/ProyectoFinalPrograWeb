import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

export const createApp = () => {
  const app = express();

  // Security Middlewares (OWASP)
  app.use(helmet());
  app.use(
    cors({
      origin: true, // Permite peticiones de Vercel y localhost
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing with security limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Root welcoming endpoint
  app.get('/', (_req, res) => {
    res.json({
      status: 'online',
      service: 'ReserveHub API (Backend)',
      message: 'El servidor backend está funcionando correctamente. Para usar la aplicación web, abre el frontend.',
      endpoints: {
        health: '/api/health',
        spaces: '/api/spaces',
        auth: '/api/auth',
        reservations: '/api/reservations',
      },
    });
  });

  // API Routes
  app.use('/api', routes);

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada en la API de ReserveHub.',
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
