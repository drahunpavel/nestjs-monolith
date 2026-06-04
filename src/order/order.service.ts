import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { CreateOrderDto } from './dto/create.order.dto';
import Redis from 'ioredis';

@Injectable()
export class OrderService {
  private readonly cacheKey = 'orders:all';
  private readonly cacheTtlSec = 60;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct, isPaid, paymentIntentId, totalAmount } = dto;


    await this.invalidateOrdersCache();

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

    const cached = await this.redis.get(this.cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const orders = await this.prisma.order.findMany({
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

    await this.redis.setex(this.cacheKey, this.cacheTtlSec, JSON.stringify(orders));

    return orders;
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

    await this.invalidateOrdersCache();

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

    await this.invalidateOrdersCache();

    return this.prisma.order.delete({
      where: { id },
    });
  }

  async invalidateOrdersCache() {
    await this.redis.del(this.cacheKey);
  }
}
