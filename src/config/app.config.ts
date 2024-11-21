import type { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import swagger, { type ElysiaSwaggerConfig } from "@elysiajs/swagger";
import { ErrorHandler } from "../middleware/error.middleware";
import LoggerService from "../helper/logger.service";

export class ElysiaFactory {
  static async create(AppModule: new () => any, app: Elysia): Promise<Elysia> {
    LoggerService(ElysiaFactory.name).log("Starting Elysia application...");
    app.use(swagger(SWAGGER_CONFIG));
    app.use(cors(CORS_CONFIG));
    app.onError(ErrorHandler);

    const app_module_instance = new AppModule();
    if (app_module_instance.init) return app_module_instance.init(app);

    const error = `Failed to get AppModule, Does ${AppModule.name} has @Module decorator`;
    console.error(error);
    process.exit(-1);
  }
}

const CORS_CONFIG = { origin: "*" };

const SWAGGER_CONFIG: ElysiaSwaggerConfig<"/api/docs"> = {
  exclude: ["/api/docs", "/api/docs/json", "/api/ready", "/api/live"],
  path: "/api/docs",
  provider: "swagger-ui",
  autoDarkMode: false,
  documentation: {
    info: {
      title: Bun.env.SWAGGER_TITLE ?? "API Docs",
      version: Bun.env.SWAGGER_VERSION ?? "1.0",
      description: Bun.env.SWAGGER_DESC ?? "API documentation",
      contact: {
        email: Bun.env.SWAGGER_CONTACT_EMAIL ?? "ateebkhan997@gmail.com",
        name: Bun.env.SWAGGER_CONTACT_NAME ?? "Ateeb Khan",
        url:
          Bun.env.SWAGGER_CONTACT_URL ?? "https://ateebportfolio.vercel.app/",
      },
    },
    security: [{ BearerAuth: [] }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
};
