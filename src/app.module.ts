import { AppController } from './app.controller';
import { Module } from './utils/decorators/module.decorator';

@Module({ controllers: [AppController] })
export class AppModule {}
