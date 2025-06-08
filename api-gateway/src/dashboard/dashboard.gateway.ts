import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { UseGuards, Inject } from '@nestjs/common';
  import { WsAuthGuard } from './guards/ws-auth.guard';
  import { ClientProxy } from '@nestjs/microservices';
  
  @UseGuards(WsAuthGuard)
  @WebSocketGateway()
  export class DashboardGateway {
    constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}
  
    @SubscribeMessage('get-dashboard')
    async getDashboard(@MessageBody() data: any) {
      // Delegar al microservicio dashboard en el futuro
      return { message: 'Dashboard data placeholder' };
    }
  }