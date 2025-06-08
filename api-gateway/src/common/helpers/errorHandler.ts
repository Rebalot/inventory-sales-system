import { ServiceUnavailableException } from "@nestjs/common";
import { mapRpcToHttp } from "./rpc-to-http";
import { TimeoutError } from "rxjs";

export function handleError(error: any): never {
        if (error instanceof TimeoutError) {
        throw new ServiceUnavailableException('Authentication service did not respond in time');
        }
        throw mapRpcToHttp(error);
    }