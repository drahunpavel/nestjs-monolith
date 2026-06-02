import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { BaseResourceService } from 'src/common/base-resource/base.resource.service';

@Injectable() // Этот класс можно создавать и внедрять через Nest, не через new UserService()
export class UserService extends BaseResourceService {
    constructor(prisma: PrismaService) {
        super(prisma, 'user');
    }
}
