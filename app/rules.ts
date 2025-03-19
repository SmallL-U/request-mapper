import { Context } from 'koa';
import { RouteMethod } from './types';
import { ObjectSchema } from 'joi';
import Joi from 'joi';

export interface MappingRule {
  path: string;
  method: RouteMethod;
  schema?: ObjectSchema;
  mapping: {
    url: string;
    method: RouteMethod;
    input: (original: Record<string, any>, ctx: Context) => Record<string, any>;
  };
}

export const rules: MappingRule[] = [
  {
    path: '/custom-path',
    method: 'post',
    schema: Joi.object({
      a: Joi.number().required(),
      b: Joi.string().required(),
    }),
    mapping: {
      url: 'http://localhost:8080',
      method: 'post',
      input: (original: Record<string, any>) => ({
        aaa: original.a,
        bbb: `bbb${original.b}`,
      }),
    },
  },
];
