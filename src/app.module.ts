import { AuthController } from './auth/auth.controller';
import { FynderWebsocket } from './auth/fynder.websocket';
import { Module } from './settings/decorators';

@Module({ controllers: [AuthController, FynderWebsocket] })
export class AppModule {}
