import { Context } from 'koa';
import { ObjectSchema } from 'joi';

type RouteMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Route = {
  path: string;
  method: RouteMethod;
  handler: (ctx: Context) => unknown;
  schema?: ObjectSchema;
};
