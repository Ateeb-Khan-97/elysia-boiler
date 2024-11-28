import { createParameterDecorator } from '@/helper/create-decorator';
import type { Handler } from 'elysia';

export const AuthHandler: Handler = async (c) => {
  // TODO: ADD AUTH MECHANISM HERE
  (c.store as any)['userId'] = 1;
};

export const CurrentUser = createParameterDecorator((c) => (c.store as any)['userId']);
