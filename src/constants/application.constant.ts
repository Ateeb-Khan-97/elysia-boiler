import { ENV } from '../utils/env.util';

export const APP_CONST = {
  PORT: ENV.PORT,
  BOOTSTRAP_MSG: `Application started at http://localhost:${ENV.PORT}`,
  DATABASE_MSG: `Database connected`,
};

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
