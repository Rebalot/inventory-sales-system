import { HttpException } from '@nestjs/common';

export const rpcToHttpStatusMap: Record<number, number> = {
    0: 200,  // OK
    1: 499,  // CANCELLED
    2: 500,  // UNKNOWN
    3: 400,  // INVALID_ARGUMENT
    4: 504,  // DEADLINE_EXCEEDED
    5: 404,  // NOT_FOUND
    6: 409,  // ALREADY_EXISTS
    7: 403,  // PERMISSION_DENIED
    8: 429,  // RESOURCE_EXHAUSTED
    9: 400,  // FAILED_PRECONDITION
    10: 409, // ABORTED
    11: 400, // OUT_OF_RANGE
    12: 501, // UNIMPLEMENTED
    13: 500, // INTERNAL
    14: 503, // UNAVAILABLE
    15: 500, // DATA_LOSS
    16: 401, // UNAUTHENTICATED
  };
  export function mapRpcToHttp(error: any): HttpException {

    const statusCode = typeof error === 'object' && error.status ? error.status : 500;
    const message = typeof error === 'object' && error.message ? error.message : 'Unexpected microservice error';

    const httpStatus = rpcToHttpStatusMap[statusCode];
    return new HttpException(message, httpStatus);

  }