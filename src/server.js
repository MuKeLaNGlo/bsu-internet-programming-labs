const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const database = require('./config/database');

const PORT = config.port;

async function startServer() {
  try {
    await database.initialize();

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
      logger.info(`API documentation: http://localhost:${PORT}`);
      logger.info(`Products endpoint: http://localhost:${PORT}/api/products`);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

const serverPromise = startServer();

serverPromise.then(server => {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    database.close().then(() => {
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    database.close().then(() => {
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    database.close().then(() => process.exit(1));
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    database.close().then(() => process.exit(1));
  });
});