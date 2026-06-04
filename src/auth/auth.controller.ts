import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { UserService } from 'src/user/user.service';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { GoogleAuthGuard } from './guards/google.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  /**
   * любое обрашение будет проходить через этот метод (quard)
   * этот метод валидирует пользователя и возвращает его
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // async profile(@Req() req) {
  //   return req.user;
  // }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user) {
    return user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async google(@Req() req) {
    return req.user;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req) {

    const email = req.user.emails?.[0]?.value;

    return this.authService.googleAuth(email);
  }
}
