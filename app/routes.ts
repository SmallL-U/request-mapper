import { createLogger } from './utils/logger';
import { Context } from 'koa';
import Router from 'koa-router';
import { Route } from './types';
import path from 'node:path';
import * as fs from 'node:fs';

const logger = createLogger({
  prefix: 'Routes',
});

const extractBodyOrQuery = (ctx: Context) => {
  const { method } = ctx.request;
  if (method === 'GET' || method === 'DELETE') {
    return ctx.query;
  }
  return ctx.request.body;
};

const baseHandler = async (route: Route, ctx: Context) => {
  // If non schema, call directly
  if (!route.schema) {
    await route.handler(ctx);
    return;
  }
  // If schema, validate
  const { schema, handler } = route;
  const toCheck = extractBodyOrQuery(ctx);
  try {
    await schema.validateAsync(toCheck);
  } catch (err) {
    // validate failed
  }
  // validate success
  await handler(ctx);
};

function registerRoute(router: Router, route: Route, basePath: string) {
  const fullPath = path.posix.join(basePath, route.path);
  (<any>router)[route.method](fullPath, async (ctx: Context) => {
    await baseHandler(route, ctx);
  });
}

async function registerRoutes(
  router: Router,
  dir: string,
  basePath: string = '/'
) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory())
      await registerRoutes(router, filePath, path.posix.join(basePath, file));
    else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
      const routeModule = await import(filePath);
      // if default is empty obj
      if (Object.keys(routeModule.default).length === 0) {
        logger.warn(
          'No default export found in %s',
          path.relative(__dirname, filePath)
        );
        continue;
      }
      // not empty obj
      const routes: Route[] = routeModule.default;
      for (const route of routes) {
        registerRoute(router, route, basePath);
        logger.info(
          `Registered route: ${route.method.toUpperCase()} ${path.posix.join(basePath, route.path)}`
        );
      }
    }
  }
}

export default async () => {
  const router = new Router();
  await registerRoutes(router, path.join(__dirname, 'routes'));
  logger.info('Routes registered');
  return router.routes();
};
