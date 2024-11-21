import Elysia from "elysia";
import { AppModule } from "./app.module";
import { ElysiaFactory } from "./config/app.config";
import { APP_CONST } from "./constants/application.constant";
import LoggerService from "./helper/logger.service";

async function bootstrap() {
  const app = await ElysiaFactory.create(AppModule, new Elysia());

  app.listen(APP_CONST.PORT, () => LoggerService.log(APP_CONST.BOOTSTRAP_MSG));
}

bootstrap();
