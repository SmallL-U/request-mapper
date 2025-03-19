import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Context } from 'koa';
import { MappingRule } from '../rules';

export class RequestMapper {
  private rules: MappingRule[];

  constructor(rules: MappingRule[]) {
    this.rules = rules;
  }

  private findMatchingRule(
    path: string,
    method: string
  ): MappingRule | undefined {
    return this.rules.find(
      (rule) =>
        rule.path === path && rule.method.toLowerCase() === method.toLowerCase()
    );
  }

  private getRequestData(ctx: Context, method: string): Record<string, any> {
    const isQueryMethod =
      method.toLowerCase() === 'get' || method.toLowerCase() === 'delete';
    return isQueryMethod
      ? (ctx.query as Record<string, any>)
      : (ctx.request.body as Record<string, any>);
  }

  private validateData(
    data: Record<string, any>,
    schema: any
  ): { error?: string; value?: Record<string, any> } {
    const { error, value } = schema.validate(data);
    if (error) {
      return { error: error.details[0].message };
    }
    return { value };
  }

  private async forwardRequest(
    rule: MappingRule,
    data: Record<string, any>,
    ctx: Context
  ) {
    const { url, method, input, schema } = rule.mapping;

    // Validate input data if schema exists
    if (schema) {
      const validation = this.validateData(data, schema);
      if (validation.error) {
        ctx.status = 400;
        return { error: validation.error };
      }
      data = validation.value!;
    }

    // Transform input data using the mapping function
    const transformedData = input(data, ctx);

    const config: AxiosRequestConfig = {
      url,
      method: method.toLowerCase(),
      headers: {
        ...ctx.request.headers,
        host: new URL(url).host,
      },
    };

    // Add data to request based on method
    if (['get', 'delete'].includes(method.toLowerCase())) {
      config.params = transformedData;
    } else {
      config.data = transformedData;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        ctx.status = axiosError.response?.status || 500;
        return axiosError.response?.data || { error: 'Internal Server Error' };
      }
      throw error;
    }
  }

  async handle(ctx: Context): Promise<void> {
    const { path, method } = ctx;
    const rule = this.findMatchingRule(path, method);

    if (!rule) {
      ctx.status = 404;
      ctx.body = { error: 'No matching rule found' };
      return;
    }

    const requestData = this.getRequestData(ctx, method);
    const result = await this.forwardRequest(rule, requestData, ctx);

    ctx.body = result;
  }
}
