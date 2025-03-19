import { Context } from 'koa';
import { RouteMethod } from './types';
import { ObjectSchema } from 'joi';
import Joi from 'joi';

export interface MappingRule {
  path: string;
  method: RouteMethod;
  mapping: {
    url: string;
    method: RouteMethod;
    schema?: ObjectSchema;
    input: (original: Record<string, any>, ctx: Context) => Record<string, any>;
  };
}

export const rules: MappingRule[] = [
  {
    path: '/custom-path',
    method: 'post',
    mapping: {
      url: 'http://localhost:8080',
      method: 'post',
      schema: Joi.object({
        a: Joi.number().required(),
        b: Joi.string().required(),
      }),
      input: (original: Record<string, any>) => ({
        aaa: original.a,
        bbb: `bbb${original.b}`,
      }),
    },
  },
];
