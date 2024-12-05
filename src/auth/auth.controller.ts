import { LoggerService } from '@/settings/logger.service';
import { ApiTag, Controller, Post, Public } from '../settings/decorators';
import { AuthService } from './auth.service';

@ApiTag('Auth')
@Controller('/api/auth')
export class AuthController {
	private readonly logger = LoggerService(AuthController.name);
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('/signin')
	async signinHandler() {}

	@Public()
	@Post('/signup')
	async signupHandler() {}
}
