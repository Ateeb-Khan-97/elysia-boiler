import {
  Controller,
  Public,
  ApiTag,
  Post,
} from "@/utils/decorators/controller.decorator";
import { Inject } from "@/utils/decorators/service.decorator";
import { AuthService } from "./auth.service";

@ApiTag("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post("/sign-up")
  async signupHandler() {}

  @Public()
  @Post("/sign-in")
  async signinHandler() {}
}
