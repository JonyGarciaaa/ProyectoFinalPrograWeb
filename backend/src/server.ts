import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 4000;
const app = createApp();

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully via Prisma');

    const server = app.listen(PORT, () => {
      console.log(`🚀 ReserveHub Backend API running at http://localhost:${PORT}`);
      console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🔒 Prisma disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Failed to connect to database or start server:', error);
    process.exit(1);
  }
}

startServer();
