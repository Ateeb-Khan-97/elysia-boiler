import LoggerService from '@/helper/logger.service';
import type { Elysia, ErrorHandler, Handler } from 'elysia';

type IBaseModule = new (...props: any[]) => any;
type Plugin = Array<any>;
type ICreateParameters = {
  baseModule: IBaseModule;
  plugins: Plugin;
  authMiddleware?: Handler;
  errorHandler?: ErrorHandler<any, any>;
};

export class ElysiaFactory {
  private static logger = LoggerService(ElysiaFactory.name);

  static async create(app: Elysia, props: ICreateParameters): Promise<Elysia> {
    this.logger.log('Starting Express application...');

    //? ADDING MIDDLEWARES
    props.plugins.map((eachPlugin) => app.use(eachPlugin));
    props.errorHandler && app.onError(props.errorHandler);

    //? ADDING MODULE CLASS
    if ((props.baseModule as any).init)
      return await (props.baseModule as any).init(app, props.authMiddleware);

    console.error(`Invalid ${props.baseModule.name} Class, add @Module() decorator`);
    process.exit(-1);
  }
}
