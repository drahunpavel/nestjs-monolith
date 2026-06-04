import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * любое обрашение будет проходить через этот метод (quard)
   * этот метод валидирует пользователя и возвращает его
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    // return this.authService.login(req.user);
    return req.user;
  }
}
