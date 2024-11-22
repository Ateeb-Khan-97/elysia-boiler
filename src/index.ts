import Elysia from 'elysia';
import { ElysiaFactory } from './config/elysia-factory.config';
import { AppModule } from './app.module';

import LoggerService from './helper/logger.service';
import swagger from '@elysiajs/swagger';
import cors from '@elysiajs/cors';

import { APP_CONST } from './constants/application.constant';
import { SWAGGER_CONFIG } from './config/swagger.config';
import { CORS_CONFIG } from './config/cors.config';
import { ErrorHandler } from './middleware/error.middleware';
import { AuthHandler } from './middleware/auth.middleware';

async function bootstrap() {
  const app = await ElysiaFactory.create(new Elysia(), {
    baseModule: AppModule,
    plugins: [swagger(SWAGGER_CONFIG), cors(CORS_CONFIG)],
    errorHandler: ErrorHandler,
    authMiddleware: AuthHandler,
  });

  app.listen(APP_CONST.PORT, () => LoggerService.log(APP_CONST.BOOTSTRAP_MSG));
}

bootstrap();
