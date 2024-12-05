import { HttpStatus } from './http-status.constant';

interface IHttpException {
	message: string;
	status: number;
}

export class HttpException extends Error implements IHttpException {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.name = this.constructor.name;
		this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ForbiddenException extends HttpException {
	constructor(message: string = HttpStatus.FORBIDDEN_MESSAGE) {
		super(message, HttpStatus.FORBIDDEN);
	}
}

export class BadRequestException extends HttpException {
	constructor(message: string = HttpStatus.BAD_REQUEST_MESSAGE) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

export class UnauthorizedException extends HttpException {
	constructor(message: string = HttpStatus.UNAUTHORIZED_MESSAGE) {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}

export class NotFoundException extends HttpException {
	constructor(message: string = HttpStatus.NOT_FOUND_MESSAGE) {
		super(message, HttpStatus.NOT_FOUND);
	}
}

export class MethodNotAllowedException extends HttpException {
	constructor(message: string = HttpStatus.METHOD_NOT_ALLOWED_MESSAGE) {
		super(message, HttpStatus.METHOD_NOT_ALLOWED);
	}
}
