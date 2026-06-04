import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/types/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // прокидываем сервисы из модулей
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const comparedPassword = await bcrypt.compare(
      password,
      user?.password ?? '',
    );

    if (!comparedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user && comparedPassword) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const { email, id } = user;

    return {
      email,
      id,
      token: this.jwtService.sign({ email, id }),
    };
  }
}
