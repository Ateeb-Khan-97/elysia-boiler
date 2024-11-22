import { AppService } from './app.service';
import { CurrentUser } from './middleware/auth.middleware';
import { ApiTag, Controller, Post, Public } from './utils/decorators/controller.decorator';
import { Inject } from './utils/decorators/injection.decorator';

@ApiTag('App')
@Controller('/api/app')
export class AppController {
  constructor(
    @Inject()
    private readonly appService: AppService
  ) {}

  @Post('/')
  async testHandler(@CurrentUser userId: number) {}
}
