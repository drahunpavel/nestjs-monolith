import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
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
  ],
})
export class AppModule {}