import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class InventoryGateway implements OnGatewayInit {
//   @WebSocketServer()
//   server: Server;

//    handleConnection(client: any) {
//     console.log('Cliente conectado:', client.id);
//   }

//   emitInventoryUpdate(data: any) {
//     this.server.emit('inventory-update', data);
//   }
// }