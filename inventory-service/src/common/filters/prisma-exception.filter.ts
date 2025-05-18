import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const errorResponse = {
      prismaErrorCode: exception.code,
      message: 'Database error',
      details: exception.meta,
    };

    switch (exception.code) {
      case 'P2002':
        errorResponse.message = 'Unique constraint failed';
        break;
      case 'P2025':
        errorResponse.message = 'Record not found';
        break;
      
      default:
        errorResponse.message = exception.message;
        break;
    }

    console.error('Prisma Error:', errorResponse);

    return throwError(() => new RpcException(errorResponse));
  }
}