import { RpcException } from '@nestjs/microservices';
  
export function rpcError(code: number, message: string): RpcException {
  return new RpcException({ code, message });
}