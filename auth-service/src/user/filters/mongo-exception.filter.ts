import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
  } from '@nestjs/common';
  import { MongoError, MongoServerError } from 'mongodb';
  import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
  
  @Catch(MongoServerError)
  export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        
      const errorResponse = {
        mongoErrorCode: exception.code,
        message: exception.errmsg,
      }

    // Retornar directamente una RpcException como Observable
    return throwError(() => new RpcException(errorResponse));
  }
  }