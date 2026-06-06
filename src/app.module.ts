import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ElasticModule } from './elastic/elastic.module';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
        const isProd = nodeEnv === 'production';

        return {
          pinoHttp: {
            genReqId: (req, res) => {
              const header = req.headers['x-request-id'];
              const incoming =
                typeof header === 'string'
                  ? header
                  : Array.isArray(header)
                    ? header[0]
                    : undefined;

              const id = incoming?.trim() ? incoming.trim() : randomUUID();
              res.setHeader('x-request-id', id);
              return id;
            },
            ...(isProd
              ? {}
              : {
                  transport: {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'pid,hostname',
                    },
                  },
                }),
          },
        };
      },
    }),
    PrismaModule,
    UserModule,
    OrderModule,
    ProductModule,
    BrandModule,
    AuthModule,
    RedisModule,
    ElasticModule,
    StripeModule,
    WebhookModule,
    ChatModule,
    S3Module,
  ],
})
export class AppModule {}