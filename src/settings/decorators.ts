import type Elysia from 'elysia';
import type { ClassLike } from '../types/common';
import type { AfterHandler, Context, Handler, TSchema } from 'elysia';
import { LoggerService } from '@/helper/logger.service';

const ServicesMap = new Map<string, any>();
const nextTick = () => new Promise((resolve) => process.nextTick(resolve));

export const Module = ({ controllers }: ModuleProps) => {
	return (target: ClassLike) => {
		Reflect.defineMetadata('controllers', controllers, target);
	};
};

export const Controller = (prefix: string) => {
	return (target: ClassLike) => {
		async function initializeController(
			app: Elysia,
			options?: { auth?: Handler; response?: AfterHandler },
		): Promise<Elysia> {
			LoggerService('RoutesResolver').log(`${target.name} {${prefix}}`);

			await nextTick();
			const tag: string = Reflect.getMetadata('tag', target) ?? 'default';
			const beforeHandle = options?.auth || ((c: Context) => {});
			const afterHandle = options?.response || ((c: Context) => {});

			const services = (Reflect.getMetadata('design:paramtypes', target) || []).map(
				(EachService: ClassLike) => {
					const instance = ServicesMap.get(EachService.name);
					if (!instance) {
						console.error(`Injected service is undefined in ${target.name}`);
						console.error('Make sure injected service has @Service decorator');
						process.exit(-1);
					}
					return instance;
				},
			);

			const controller = new target(...services);
			const metadata: Metadata[] = Reflect.getMetadata('metadata', target) || [];
			for (const eachMetadata of metadata) {
				const bondedHandler = eachMetadata.handler.bind(controller);
				app.route(
					eachMetadata.method,
					prefix + eachMetadata.path,
					async (c) => {
						const handlerParameters = [];
						if (eachMetadata.bodySchema) {
							handlerParameters[eachMetadata.bodySchema.index] = c.body;
						}
						if (eachMetadata.querySchema) {
							handlerParameters[eachMetadata.querySchema.index] = c.query;
						}
						if (eachMetadata.paramSlug) {
							handlerParameters[eachMetadata.paramSlug.index] = c.params?.[eachMetadata.paramSlug.slug];
						}

						if (eachMetadata.customDecorators) {
							for (const eachCustomDecorator of eachMetadata.customDecorators) {
								handlerParameters[eachCustomDecorator.index] = await eachCustomDecorator.handler(c);
							}
						}

						return await bondedHandler(...handlerParameters);
					},
					{
						afterHandle,
						beforeHandle: eachMetadata.isPublic ? undefined : beforeHandle,
						config: {},
						tags: [tag],
						body: eachMetadata.bodySchema?.schema,
						query: eachMetadata.querySchema?.schema as any,
						detail:
							!options?.auth || eachMetadata.isPublic
								? { security: [] }
								: { security: [{ BearerAuth: [] }] },
					},
				);

				LoggerService('RouterExplorer').log(
					`Mapped {${eachMetadata.path}, ${eachMetadata.method.toUpperCase()}} route`,
				);
			}

			return app;
		}

		Reflect.defineMetadata('initialize', initializeController, target);
	};
};

export const Websocket = (path: string, options?: { public?: boolean }) => {
	return (target: ClassLike) => {
		const isPublic = !!options?.public;
		async function initializeController(
			app: Elysia,
			options?: { auth?: Handler; response?: AfterHandler },
		): Promise<Elysia> {
			LoggerService('WebsocketResolver').log(`${target.name} {${path}}`);
			await nextTick();
			const services = (Reflect.getMetadata('design:paramtypes', target) || []).map(
				(EachService: ClassLike) => {
					const instance = ServicesMap.get(EachService.name);
					if (!instance) {
						console.error(`Injected service is undefined in ${target.name}`);
						console.error('Make sure injected service has @Service decorator');
						process.exit(-1);
					}
					return instance;
				},
			);

			const metadata = Reflect.getMetadata('metadata', target) || {};
			const controller = new target(...services);
			const open = metadata.open ? metadata.open.bind(controller) : undefined;
			const close = metadata.close ? metadata.close.bind(controller) : undefined;
			const message = metadata.message ? metadata.message.bind(controller) : undefined;

			app.ws(path, {
				beforeHandle: !isPublic && (options?.auth as any),
				open,
				close,
				message,
				body: metadata.body,
			});

			return app;
		}

		Reflect.defineMetadata('initialize', initializeController, target);
	};
};

export const Open = (): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		const metadata = Reflect.getMetadata('metadata', target.constructor) ?? {};
		metadata.open = desc.value;
		Reflect.defineMetadata('metadata', metadata, target.constructor);
	};
};

export const Close = (): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		const metadata = Reflect.getMetadata('metadata', target.constructor) ?? {};
		metadata.close = desc.value;
		Reflect.defineMetadata('metadata', metadata, target.constructor);
	};
};

export const Message = (schema?: TSchema): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		const metadata = Reflect.getMetadata('metadata', target.constructor) ?? {};
		metadata.message = desc.value;
		metadata.body = schema;
		Reflect.defineMetadata('metadata', metadata, target.constructor);
	};
};

export const ApiTag = (tag: string) => {
	return (target: ClassLike) => {
		Reflect.defineMetadata('tag', tag, target);
	};
};

function httpMethodMetadataSetter(props: HttpMethodMetadataSetterProps) {
	const bodySchema = Reflect.getMetadata('body', props.handler);
	const paramSlug = Reflect.getMetadata('param', props.handler);
	const querySchema = Reflect.getMetadata('query', props.handler);
	const customDecorators = Reflect.getMetadata('customDecorators', props.handler) || [];
	const isPublic = Reflect.getMetadata('public', props.handler);

	const { path, method, handler, controllerClass } = props;
	const metadata: Metadata[] = Reflect.getMetadata('metadata', controllerClass) || [];

	metadata.push({
		path,
		method,
		bodySchema,
		paramSlug,
		querySchema,
		customDecorators,
		isPublic,
		handler: handler as any,
	});
	Reflect.defineMetadata('metadata', metadata, controllerClass);
}

export const Get = (path = '/'): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		process.nextTick(() =>
			httpMethodMetadataSetter({
				controllerClass: target.constructor as ClassLike,
				path,
				method: 'get',
				handler: desc.value,
			}),
		);
	};
};
export const Post = (path = '/'): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		process.nextTick(() =>
			httpMethodMetadataSetter({
				controllerClass: target.constructor as ClassLike,
				path,
				method: 'post',
				handler: desc.value,
			}),
		);
	};
};
export const Put = (path = '/'): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		process.nextTick(() =>
			httpMethodMetadataSetter({
				controllerClass: target.constructor as ClassLike,
				path,
				method: 'put',
				handler: desc.value,
			}),
		);
	};
};
export const Delete = (path = '/'): MethodDecorator => {
	return (target, _, desc: PropertyDescriptor) => {
		process.nextTick(() =>
			httpMethodMetadataSetter({
				controllerClass: target.constructor as ClassLike,
				path,
				method: 'delete',
				handler: desc.value,
			}),
		);
	};
};
export const Patch = (path = '/'): MethodDecorator => {
	return (target, propertyKey, desc: PropertyDescriptor) => {
		process.nextTick(() =>
			httpMethodMetadataSetter({
				controllerClass: target.constructor as ClassLike,
				path,
				method: 'patch',
				handler: desc.value,
			}),
		);
	};
};

export const Public = (): MethodDecorator => {
	return (_, __, desc: PropertyDescriptor) => {
		Reflect.defineMetadata('public', true, desc.value);
	};
};

export const Body = (schema?: TSchema) => {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		Reflect.defineMetadata('body', { schema, index: parameterIndex }, target[propertyKey]);
	};
};

export const Param = (slug: string) => {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		Reflect.defineMetadata('param', { slug, index: parameterIndex }, target[propertyKey]);
	};
};

export const Query = (schema?: TSchema) => {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		Reflect.defineMetadata('query', { schema, index: parameterIndex }, target[propertyKey]);
	};
};

export const Service = () => {
	return (target: ClassLike) => {
		const classname = target.name;
		if (ServicesMap.has(classname)) {
			console.error(`Service ${classname} already exists`);
			process.exit(-1);
		}
		ServicesMap.set(classname, new target());
	};
};

//! TYPES
type ModuleProps = { controllers: ClassLike[] };
type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
type HttpMethodMetadataSetterProps = {
	path: string;
	method: HttpMethods;
	handler: Handler;
	controllerClass: ClassLike;
};

type Metadata = {
	path: string;
	method: HttpMethods;
	handler: (...args: unknown[]) => unknown;
	bodySchema?: { schema?: TSchema; index: number };
	querySchema?: { schema?: TSchema; index: number };
	paramSlug?: { slug: string; index: number };
	isPublic?: true;
	customDecorators: { handler: Handler; index: number }[];
};
