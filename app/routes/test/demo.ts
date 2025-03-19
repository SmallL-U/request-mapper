import { Context } from 'koa';
import { createLogger } from '../../utils/logger';
import { Route } from '../../types';

const logger = createLogger({
  prefix: 'TestDemoController',
});

async function index(ctx: Context) {
  logger.info('Request received');
  ctx.body = {
    message: 'Hello, world!',
  };
}

export default [
  {
    path: '/',
    method: 'get',
    handler: index,
  },
] as Route[];
