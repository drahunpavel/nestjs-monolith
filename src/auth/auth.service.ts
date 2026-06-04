import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
