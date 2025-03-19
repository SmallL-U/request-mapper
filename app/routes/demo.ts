import { Route } from '../types';
import { createLogger } from '../utils/logger';
import { Context } from 'koa';

const logger = createLogger({
  prefix: 'DemoController',
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
