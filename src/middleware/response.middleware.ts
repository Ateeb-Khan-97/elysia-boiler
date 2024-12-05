import Stream from '@elysiajs/stream';
import type { AfterHandler } from 'elysia';

export const ResponseHandler: AfterHandler = (c) => {
	if ((c.response as any) instanceof Stream) return c.response;

	const RESPONSE = { status: 200, message: 'OK', data: null as unknown, success: true };

	if (typeof c.response !== 'object' || Array.isArray(c.response))
		throw new Error('Response must be an object');

	const { status = 200, message = 'OK', data = null } = c.response;
	RESPONSE.status = status;
	RESPONSE.message = message;
	RESPONSE.data = data;
	RESPONSE.success = status >= 200 && status < 300;

	c.set.status = status;
	return RESPONSE;
};
