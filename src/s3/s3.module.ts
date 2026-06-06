import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  imports: [ConfigModule],
  controllers: [S3Controller],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (config: ConfigService) => {
        return new S3Client({
          endpoint: config.getOrThrow<string>('MINIO_URL'),
          region: config.get<string>('S3_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: config.getOrThrow<string>('MINIO_ROOT_USER'),
            secretAccessKey: config.getOrThrow<string>('MINIO_ROOT_PASSWORD'),
          },
          forcePathStyle: config.get('S3_FORCE_PATH_STYLE') === 'true',
        });
      },
      inject: [ConfigService],
    },
    S3Service,
  ],
  exports: [S3Service, 'S3_CLIENT'],
})
export class S3Module {}
