import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client/extension';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

// Это глобальный обработчик ошибок Prisma, перехватывает сбои БД и отдаёт клиенту понятный HTTP-ответ вместо сырого stack trace
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Database error';
    let statusCode = 500;

    if (exception.code === 'P2002') {
      message = `Unique constraint failed on fields: ${exception.meta?.target}`;
      statusCode = 400;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
    });
  }
}