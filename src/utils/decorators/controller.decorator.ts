import 'reflect-metadata';
import type { Handler, TSchema } from 'elysia';
import type Elysia from 'elysia';
import { injectServices } from './injection.decorator';
import { HttpStatus } from '@/helper/http-status.constant';
import LoggerService from '@/helper/logger.service';

type IMethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';
type IClassLike = any;
type IMetadata = {
  path: string;
  method: (...props: any) => any;
  methodType: IMethodType;
  public?: true;
  body?: { index: number; schema?: TSchema };
  query?: { index: number; schema?: TSchema };
  param?: { index: number; key: string };
  customDecorators?: Array<{ index: number; handler: Handler }>;
};

const nextTick = (): Promise<void> => new Promise((res) => process.nextTick(res));

export const ApiTag = (apiTag: string) => {
  return (target: IClassLike) => {
    Reflect.defineMetadata('api-tag', apiTag, target);
  };
};

export const Controller = (prefix: string) => {
  return (target: IClassLike) => {
    async function init(
      app: Elysia,
      authMiddleware?: Handler,
      responseMapper?: (res: any, set: { status?: number | string }) => any
    ) {
      LoggerService('RoutesResolver').log(`${target.name} {${prefix}}`);

      await nextTick();
      const apiTag: string | undefined = Reflect.getMetadata('api-tag', target);
      const metadata: IMetadata[] = Reflect.getMetadata('metadata', target) || [];
      const controllerInstance = injectServices(target);

      for (const em of metadata) {
        const path = prefix + em.path;
        const boundHandler = em.method.bind(controllerInstance);
        const isGenerator = boundHandler.constructor.name.toLowerCase().includes('generator');
        const handlerParameters: any[] = [];
        const isPublic = !!(!authMiddleware || em.public);

        if (isGenerator) {
          app.route(em.methodType, path, async function* (c) {
            if (em.body) handlerParameters[em.body.index] = c.body;
            if (em.query) handlerParameters[em.query.index] = c.query;
            if (em.param) handlerParameters[em.param.index] = c.params[em.param.key];
            if (em.customDecorators && em.customDecorators.length > 0)
              for (const cd of em.customDecorators)
                handlerParameters[cd.index] = await cd.handler(c);

            const iterable = await boundHandler(...handlerParameters);
            try {
              for await (const chunk of iterable) yield chunk;
            } catch (error: any) {
              yield {
                status: error?.status ?? HttpStatus.BAD_REQUEST,
                message: error?.message ?? HttpStatus.BAD_REQUEST_MESSAGE,
                data: null,
                success: false,
              };
            }
          });

          const msg = `Mapped {${path}, ${em.methodType.toUpperCase()}} route`;
          LoggerService('RouterExplorer').log(msg);
          continue;
        }

        app.route(
          em.methodType,
          path,
          async (c) => {
            if (em.body) handlerParameters[em.body.index] = c.body;
            if (em.query) handlerParameters[em.query.index] = c.query;
            if (em.param) handlerParameters[em.param.index] = c.params[em.param.key];
            if (em.customDecorators && em.customDecorators.length > 0) {
              for (const cd of em.customDecorators) {
                handlerParameters[cd.index] = await cd.handler(c);
              }
            }

            const response = await boundHandler(...handlerParameters);
            c.set.status = response?.status ?? HttpStatus.OK;

            if (responseMapper) return responseMapper(response, c.set);
            return response;
          },
          {
            // @ts-ignore
            query: em.query?.schema,
            body: em.body?.schema,
            config: { allowMeta: true },
            tags: apiTag ? [apiTag] : undefined,
            beforeHandle: authMiddleware ? authMiddleware : undefined,
            detail: isPublic ? { security: [] } : { security: [{ BearerAuth: [] }] },
          }
        );

        const msg = `Mapped {${path}, ${em.methodType.toUpperCase()}} route`;
        LoggerService('RouterExplorer').log(msg);
      }

      return app;
    }

    (target as any)['init'] = init;
  };
};

function httpMethodMetadataSetter(props: {
  target: IClassLike;
  value: any;
  path: string;
  methodType: IMethodType;
}) {
  const c_metadata = Reflect.getMetadata('metadata', props.target.constructor) ?? [];
  const metadata = Reflect.getMetadata('metadata', props.value) ?? {};

  metadata['path'] = props.path;
  metadata['method'] = props.value;
  metadata['methodType'] = props.methodType;

  c_metadata.push(metadata);
  Reflect.defineMetadata('metadata', metadata, props.value);
  Reflect.defineMetadata('metadata', c_metadata, props.target.constructor);
}

export const Get = (path = '/') => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, methodType: 'get', path }));
  };
};
export const Put = (path = '/') => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, methodType: 'put', path }));
  };
};
export const Post = (path = '/') => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, methodType: 'post', path }));
  };
};
export const Patch = (path = '/') => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, methodType: 'patch', path }));
  };
};
export const Delete = (path = '/') => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, methodType: 'delete', path }));
  };
};

export const Public = () => {
  return (target: IClassLike, pk: string, { value }: PropertyDescriptor) => {
    const metadata = Reflect.getMetadata('metadata', target[pk]) ?? {};
    metadata['public'] = true;
    Reflect.defineMetadata('metadata', metadata, target[pk]);
  };
};

export const Body = (schema?: TSchema) => {
  return (target: any, pk: string, pi: number) => {
    const metadata = Reflect.getMetadata('metadata', target[pk]) ?? {};
    metadata['body'] = { index: pi, schema };
    Reflect.defineMetadata('metadata', metadata, target[pk]);
  };
};

export const Query = (schema?: TSchema) => {
  return (target: any, pk: string, pi: number) => {
    const metadata = Reflect.getMetadata('metadata', target[pk]) ?? {};
    metadata['query'] = { index: pi, schema };
    Reflect.defineMetadata('metadata', metadata, target[pk]);
  };
};

export const Param = (key: string) => {
  return (target: any, pk: string, pi: number) => {
    const metadata = Reflect.getMetadata('metadata', target[pk]) ?? {};
    metadata['param'] = { index: pi, key };
    Reflect.defineMetadata('metadata', metadata, target[pk]);
  };
};
