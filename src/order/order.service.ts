import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { CreateOrderDto } from './dto/create.order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct, isPaid, paymentIntentId, totalAmount } = dto;

    return this.prisma.order.create({
      data: {
        user: {
          // привязывает существующего пользователя по id
          // если пользователя нет, то будет ошибка
          connect: {
            id: userId,
          },
        },
        orderProducts: {
          // создает новые продукты в заказе
          create: orderProduct.map(({ productId }) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      // включает связанные модели
      include: {
        orderProducts: {
          include: {
            // включает связанные модели
            product: true,
          },
        },
        // user: true
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { userId, orderProduct } = dto;

    return this.prisma.order.update({
      where: { id },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        orderProducts: {
          deleteMany: {}, // удаляет все продукты в заказе
          create: orderProduct?.map(({ productId }) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
