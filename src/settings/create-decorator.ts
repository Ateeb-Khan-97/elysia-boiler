import type { Handler } from 'elysia';

export const createCustomParameterDecorator = (handler: Handler) => {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		const customDecorators = Reflect.getMetadata('customDecorators', target[propertyKey]) || [];
		customDecorators.push({ handler, index: parameterIndex });
		Reflect.defineMetadata('customDecorators', customDecorators, target[propertyKey]);
	};
};
