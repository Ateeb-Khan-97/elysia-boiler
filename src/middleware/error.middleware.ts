import {
  NotFoundError,
  ValidationError,
  type ErrorHandler as ElysiaErrorHandler,
} from "elysia";
import { HttpStatus } from "../helper/http-status.constant";

export const ErrorHandler: ElysiaErrorHandler<any, any> = ({
  request,
  error,
  set,
}) => {
  const RESPONSE = {
    success: false,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.INTERNAL_SERVER_ERROR_MESSAGE,
    data: null as any,
  };

  if (error instanceof NotFoundError) {
    const url = new URL(request.url);

    RESPONSE["status"] = HttpStatus.NOT_FOUND;
    RESPONSE["message"] = `Cannot ${request.method.toUpperCase()} ${
      url.pathname
    } NOT FOUND`;
  }

  if (error instanceof ValidationError) {
    const cause = error.all[0];
    RESPONSE["status"] = HttpStatus.BAD_REQUEST;
    RESPONSE["message"] = "Validation failed";

    if (cause.summary != undefined) {
      const path = cause.path.replaceAll("/", "");
      const message = cause.message as string;
      RESPONSE["message"] = `Field ${path} is ${message.toLowerCase()}`;
    }
  }

  set.status = RESPONSE.status;
  return RESPONSE;
};
