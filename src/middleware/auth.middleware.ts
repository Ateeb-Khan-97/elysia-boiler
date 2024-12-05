import { createCustomParameterDecorator } from '@/settings/create-decorator';
import type { Handler } from 'elysia';

export const AuthHandler: Handler = (c) => {
	const authHeader = c.request.headers.get('Authorization');
	// if (!authHeader || !authHeader.startsWith('Bearer ')) {
	//     throw new Error('Unauthorized');
	// }

	// const token = authHeader.split(' ')[1];
	(c.store as any).user = 1;
};

export const CurrentUser = () =>
	createCustomParameterDecorator((c) => {
		return (c.store as any).user || -1;
	});
