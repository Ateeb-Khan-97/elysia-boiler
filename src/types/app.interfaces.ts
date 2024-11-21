import type Elysia from "elysia";
import type { ElysiaWS } from "elysia/ws";

export type WS = ElysiaWS<any, any>;

export interface ApplicationModule {
  init(app: Elysia): Promise<Elysia>;
}

export interface WebsocketClass {
  open(ws: WS): any;
  close(ws: WS): any;
  message(ws: WS, message: any): any;
}
