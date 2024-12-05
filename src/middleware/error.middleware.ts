import { NotFoundError, ValidationError, type ErrorHandler as ElysiaErrorHandler } from 'elysia';

export const ErrorHandler: ElysiaErrorHandler = (c) => {
	const RESPONSE = {
		status: (c.error as any).status || 500,
		message: c.error.message || 'Internal Server Error',
		data: null as unknown,
		success: false,
	};

	if (c.error instanceof NotFoundError) {
		const url = new URL(c.request.url);

		RESPONSE.status = 404;
		RESPONSE.message = `Cannot ${c.request.method.toUpperCase()} ${url.pathname} NOT FOUND`;
	}

	if (c.error instanceof ValidationError) {
		const cause = c.error.all[0];
		RESPONSE.status = 400;
		RESPONSE.message = 'Validation failed';

		if (cause.summary !== undefined) {
			const path = cause.path.replaceAll('/', '');
			const message = cause.message as string;
			RESPONSE.message = `Field ${path} is ${message.toLowerCase()}`;
		}
	}

	c.set.status = RESPONSE.status;
	return RESPONSE;
};
