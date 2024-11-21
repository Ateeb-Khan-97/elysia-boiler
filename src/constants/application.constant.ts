import { ENV } from "../utils/env.util";

export const APP_CONST = {
  PORT: ENV.PORT,
  BOOTSTRAP_MSG: `Application started at http://localhost:${ENV.PORT}`,
};
