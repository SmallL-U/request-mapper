import { createLogger } from './utils/logger';
import config, { configCheck } from './config';
import Koa from 'koa';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import { Server } from 'node:net';
import router from './routes';

const logger = createLogger({
  prefix: 'App',
});

(async () => {
  // Check configuration
  await configCheck();
  logger.info('Starting application...');
  const app = new Koa();
  // Middleware
  app.use(koaLogger());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  // Start
  const server: Server = app.listen(parseInt(config.port));
  logger.info('Application started on port %s', config.port);
  // Graceful shutdown
  const shutdown = () => {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
