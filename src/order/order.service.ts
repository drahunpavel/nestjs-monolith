import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { CreateOrderDto } from './dto/create.order.dto';
import Redis from 'ioredis';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  private readonly cacheKey = 'orders:all';
  private readonly cacheTtlSec = 60;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe.Stripe,
  ) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct, isPaid, paymentIntentId, totalAmount } = dto;

    await this.invalidateOrdersCache();


    let createdPaymentIntentId = paymentIntentId;
    if(!isPaid) {
      const paymentIntent = await this.stripeClient.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
      createdPaymentIntentId = paymentIntent.id;
    }
    
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
        totalAmount,
        isPaid,
        paymentIntentId: createdPaymentIntentId,
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

    await this.redis.setex(
      this.cacheKey,
      this.cacheTtlSec,
      JSON.stringify(orders),
    );

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

  async updatePaymentStatus(paymentIntentId: string, isPaid: boolean) {
    if(!paymentIntentId || !isPaid) {
      throw new BadRequestException('Payment intent ID and isPaid are required');
    }

    const paymentIntent = await this.stripeClient.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent.status === 'succeeded') {
      await this.prisma.order.update({
        where: { paymentIntentId },
        data: { isPaid },
      });
    }
    return paymentIntent;
  }
}
