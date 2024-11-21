import { AppService } from "./app.service";
import {
  ApiTag,
  Controller,
  Get,
  Public,
} from "./utils/decorators/controller.decorator";
import { Inject } from "./utils/decorators/service.decorator";

@ApiTag("App")
@Controller("/api/app")
export class AppController {
  constructor(@Inject(AppService) appService: AppService) {}

  @Public()
  @Get("/")
  async helloWorld() {
    return "hello world";
  }
}
