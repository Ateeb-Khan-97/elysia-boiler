import type { Handler } from 'elysia';
import type Elysia from 'elysia';

type IClassLike = new (...props: any[]) => any;
type IModule = { controllers: IClassLike[] };

export const Module = ({ controllers }: IModule) => {
  return (target: any) => {
    target['init'] = async (
      app: Elysia,
      authMiddleware?: Handler,
      responseMapper?: (res: any, set: { status?: number | string }) => any
    ) => {
      if (!app) {
        console.error('Elysia app not found check module decorator');
        process.exit(-1);
      }

      for (const ec of controllers) {
        if ((ec as any)?.init) {
          await (ec as any).init(app, authMiddleware, responseMapper);
          continue;
        }

        const error = `Invalid controller class ${ec?.name}, are you sure it has @Controller decorator`;
        console.error(error);
        process.exit(-1);
      }

      return app;
    };
  };
};
