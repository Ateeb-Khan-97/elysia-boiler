import { LoggerService } from '../helper/logger.service';
import { ApiTag, Controller, Post, Public, Query } from '../settings/decorators';
import { AuthService } from './auth.service';

@ApiTag('Auth')
@Controller('/api/auth')
export class AuthController {
	private readonly logger = LoggerService(AuthController.name);
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('/signin')
	async signinHandler() {
		return {};
	}

	@Public()
	@Post('/signup')
	async signupHandler() {}
}
