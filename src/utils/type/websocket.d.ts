import type { ElysiaWS } from 'elysia/ws';

export type WS = ElysiaWS<any, any, { store: { userId: number } }>;
