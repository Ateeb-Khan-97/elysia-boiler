import Stream from '@elysiajs/stream';
import { LoggerService } from '../helper/logger.service';
import { ApiTag, Controller, Post, Public } from '../settings/decorators';
import { AuthService } from './auth.service';

@ApiTag('Auth')
@Controller('/api/auth')
export class AuthController {
	private readonly logger = LoggerService(AuthController.name);
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('/signin')
	async signinHandler() {
		const stream = new Stream();

		for (let i = 0; i < 10; i++) {
			stream.send('Hi');
		}

		stream.close();
		return stream;
	}

	@Public()
	@Post('/signup')
	async signupHandler() {}
}
