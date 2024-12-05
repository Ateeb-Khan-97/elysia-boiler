import type { ServerWebSocket } from 'bun';
import type { RouteSchema, SingletonBase, TSchema } from 'elysia';
import type { ElysiaWS } from 'elysia/ws';

export type ClassLike = new (...args: any[]) => any;

export type WS = ElysiaWS<
	ServerWebSocket<{ id?: string; validator?: undefined }>,
	RouteSchema,
	{ store: { user?: number } } & SingletonBase
>;
