import { AuthController } from "./modules/auth/auth.controller";
import { Module } from "./utils/decorators/module.decorator";

@Module({ controllers: [AuthController] })
export class AppModule {}
