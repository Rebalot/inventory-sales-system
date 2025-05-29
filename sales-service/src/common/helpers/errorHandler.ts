import { status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";
import { TimeoutError } from "rxjs";


export function handleError(error: any): never{
        if (error instanceof TimeoutError) {
        throw new RpcException({
            code: status.DEADLINE_EXCEEDED,
            message: 'Request timed out',
            details: error,
        });
        }
        if (error.code && error.message) {
            throw new RpcException({
            code: error.code,
            message: error.message,
            details: error.meta || null,
            });
        }
        throw new RpcException({
            code: status.INTERNAL,
            message: error.message || 'Internal Server Error',
            details: error,
        });
    }