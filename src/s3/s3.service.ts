import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
  } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import { Inject, Injectable } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { randomUUID } from 'node:crypto';
  
  @Injectable()
  export class S3Service {
    private readonly bucket: string;
  
    constructor(
      @Inject('S3_CLIENT') private readonly s3: S3Client,
      private readonly config: ConfigService,
    ) {
      this.bucket = this.config.getOrThrow<string>('S3_BUCKET');
    }
  
    async uploadFile(file: Express.Multer.File, folder = 'files') {
      const key = `${folder}/${randomUUID()}-${file.originalname}`;
  
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
  
      return {
        key,
        url: this.getPublicUrl(key),
        signedUrl: await this.getSignedUrl(key),
      };
    }
  
    async getSignedUrl(key: string, expiresIn = 3600) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
  
      return getSignedUrl(this.s3, command, { expiresIn });
    }
  
    async deleteFile(key: string) {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
  
      return { deleted: true, key };
    }
  
    private getPublicUrl(key: string) {
      const baseUrl = this.config.getOrThrow<string>('MINIO_URL');
      return `${baseUrl}/${this.bucket}/${key}`;
    }
  }