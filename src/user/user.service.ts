import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResourceService } from 'src/common/base-resource/base.resource.service';

@Injectable() // Этот класс можно создавать и внедрять через Nest, не через new UserService()
export class UserService extends BaseResourceService {
    constructor(prisma: PrismaService) {
        super(prisma, 'user');
    }

    // async create(dto: CreateUserDto) {
    //     return this.prisma.user.create({
    //         data: dto,
    //     });
    // }

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
