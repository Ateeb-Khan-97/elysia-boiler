import 'reflect-metadata';

import { Elysia } from 'elysia';
import { ElysiaFactory } from './settings/elysia.setting';
import { AppModule } from './app.module';
import { ResponseHandler } from './middleware/response.middleware';
import { AuthHandler } from './middleware/auth.middleware';
import { ErrorHandler } from './middleware/error.middleware';
import { SwaggerConfig } from './config/swagger.config';
import { CorsConfig } from './config/cors.config';
import { ENV, isDev } from './config/env.config';
import { LoggerService } from './settings/logger.service';

async function bootstrap() {
	const app = await ElysiaFactory.create(AppModule, new Elysia(), {
		cors: CorsConfig,
		swagger: isDev() && SwaggerConfig,
		response: ResponseHandler,
		error: ErrorHandler,
		auth: AuthHandler,
	});

	app.listen(ENV.PORT, () => {
		LoggerService.log(`Application running at http://localhost:${ENV.PORT}`);
	});
}

bootstrap();
