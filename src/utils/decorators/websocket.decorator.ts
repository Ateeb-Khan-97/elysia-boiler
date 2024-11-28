import { HttpStatus } from '@/helper/http-status.constant';
import LoggerService from '@/helper/logger.service';
import type { Elysia, Handler } from 'elysia';
import type { ElysiaWS } from 'elysia/ws';
import type { ZodSchema } from 'zod';
import { injectServices } from './injection.decorator';

type WS = ElysiaWS<any, any>;
type IClassLike = new (...props: any[]) => any;
type WebsocketProps = { path: string; isPublic?: boolean };
type Metadata = {
  open?: (ws: WS) => any;
  close?: (ws: WS) => any;
  message?: (ws: WS, message: any) => any;
  body?: ZodSchema;
};

const nextTick = (): Promise<void> => new Promise((res) => process.nextTick(res));
export const Websocket = ({ path, isPublic }: WebsocketProps) => {
  return (target: IClassLike) => {
    async function init(app: Elysia, authMiddleware?: Handler) {
      LoggerService('WebsocketResolver').log(`${target.name} {${path}}`);
      await nextTick();

      const instance = injectServices(target);
      const metadata = Reflect.getMetadata('metadata', target) as Metadata;
      const open = metadata.open && metadata.open.bind(instance);
      const close = metadata.close && metadata.close.bind(instance);
      const message = metadata.message && metadata.message.bind(instance);

      const zodSchema = metadata.body;
      const validation = async (ws: WS, msg: any) => {
        if (!message) return;

        const result = zodSchema && zodSchema.safeParse(msg);
        if (!result) return await message(ws, message);
        if (result.success) return await message(ws, result.data);

        const path = result.error.errors[0].path[0] ?? 'message body';
        const reason = result.error.errors[0].message.toLowerCase();
        const error = path + ' is ' + reason;

        ws.send({ status: HttpStatus.BAD_REQUEST, message: error });
      };

      app.ws(path, {
        beforeHandle: !isPublic && (authMiddleware as any),
        sendPings: true,
        open,
        close,
        message: validation,
      });

      return app;
    }

    (target as any)['init'] = init;
  };
};

type IWsSetterProps = {
  target: IClassLike;
  value: any;
  type: 'open' | 'close' | 'message';
  schema?: ZodSchema;
};

function httpMethodMetadataSetter(props: IWsSetterProps) {
  const metadata = Reflect.getMetadata('metadata', props.target.constructor) ?? {};

  metadata[props.type] = props.value;
  metadata['body'] = props.schema;

  Reflect.defineMetadata('metadata', metadata, props.target.constructor);
}

export const Open = () => {
  return (target: any, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, type: 'open' }));
  };
};

export const Close = () => {
  return (target: any, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, type: 'close' }));
  };
};

export const Message = (schema?: ZodSchema) => {
  return (target: any, pk: string, { value }: PropertyDescriptor) => {
    process.nextTick(() => httpMethodMetadataSetter({ target, value, type: 'message', schema }));
  };
};
