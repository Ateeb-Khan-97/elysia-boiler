import type Elysia from 'elysia';
import type { ClassLike } from '../types/common';
import { cors, type CORSConfig } from '@elysiajs/cors';
import { swagger, type ElysiaSwaggerConfig } from '@elysiajs/swagger';
import type { AfterHandler, ErrorHandler, Handler } from 'elysia';
import { LoggerService } from '@/helper/logger.service';

export const ElysiaFactory = {
	create: async <T extends string>(
		module: ClassLike,
		app: Elysia,
		options?: ElysiaCreateOptions<T>,
	): Promise<Elysia> => {
		const logger = LoggerService('ElysiaFactory');
		logger.log('Starting elysia application');

		if (options?.beforeStart) {
			for (const eachBeforeStart of options.beforeStart) await eachBeforeStart();
		}

		// CORS SETTING
		if (options?.cors) {
			app.use(cors(typeof options.cors === 'object' ? options.cors : {}));
		}

		// SWAGGER SETTING
		if (options?.swagger) {
			app.use(swagger(typeof options.swagger === 'object' ? options.swagger : {}));
		}

		if (options?.error) {
			app.onError(options.error);
		}

		const controllers: ClassLike[] | undefined = Reflect.getMetadata('controllers', module);
		if (!controllers) {
			console.error('Invalid class module');
			process.exit(-1);
		}

		let injectedAppWithControllers = app;
		for (const eachControllerClass of controllers) {
			const initializeController = Reflect.getMetadata('initialize', eachControllerClass);
			if (!initializeController) {
				console.error('Invalid class module');
				process.exit(-1);
			}

			injectedAppWithControllers = await initializeController(app, {
				auth: options?.auth,
				response: options?.response,
			});
		}

		return injectedAppWithControllers;
	},
};

type fc = (...args: any[]) => any;
type ElysiaCreateOptions<T> = {
	cors?: boolean | CORSConfig;
	swagger?: boolean | ElysiaSwaggerConfig<T extends string ? T : string>;
	auth?: Handler;
	response?: AfterHandler;
	error?: ErrorHandler<any, any>;
	beforeStart?: fc[];
};
