import { t } from 'elysia';

export const AuthSchema = {
	Signin: t.Object({
		email: t.String({ format: 'email' }),
		password: t.String(),
	}),
};

export namespace AuthSchemaTypes {
	export type Signin = typeof AuthSchema.Signin.static;
}
