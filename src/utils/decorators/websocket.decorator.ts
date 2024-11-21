import LoggerService from "@/helper/logger.service";
import type Elysia from "elysia";

export function Websocket(prefix: string): ClassDecorator {
  return (target) => {
    async function init(app: Elysia) {
      LoggerService("RoutesResolver").log(`${target.name} {${prefix}}`);

      const websocketInstance = new (target as any)();
      app.ws(prefix, websocketInstance);

      return app;
    }

    (target as any)["init"] = init;
  };
}
