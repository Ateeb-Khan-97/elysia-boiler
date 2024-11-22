import { createParameterDecorator } from '@/config/create-decorator';
import type { Handler } from 'elysia';

export const AuthHandler: Handler = (c) => {
  // TODO: ADD AUTH MECHANISM HERE
  (c.store as any)['userId'] = 1;
};

export const CurrentUser = createParameterDecorator((c) => (c.store as any)['userId']);
