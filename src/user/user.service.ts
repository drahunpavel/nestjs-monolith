import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResourceService } from 'src/common/base-resource/base.resource.service';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable() // Этот класс можно создавать и внедрять через Nest, не через new UserService()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async create(dto: CreateUserDto) {
    const { email, password } = dto;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
        throw new BadRequestException('User already exists');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;


    return this.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // async findAll() {
  //     return this.prisma.user.findMany();
  // }

  // async findOne(id: number) {
  //     return this.prisma.user.findUnique({
  //         where: { id },
  //     })
  // }

  // async update(id: number, dto: UpdateUserDto) {
  //     return this.prisma.user.update({
  //         where: { id },
  //         data: dto,
  //     })
  // }

  // async remove(id: number) {
  //     return this.prisma.user.delete({
  //         where: { id },
  //     })
  // }
}
