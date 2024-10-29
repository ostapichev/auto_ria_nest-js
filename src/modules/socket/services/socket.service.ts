import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/socket',
  transports: ['websocket'],
})
export class SocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('SocketService');

  public afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  public handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  public async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.join(room);
    client.emit('joinedRoom', room);
    await this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('message')
  public async handleMessage(
    @MessageBody() { room, message }: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.logger.log(`Client send message: ${message}`);
    await this.server.to(room).emit('message', { sender: client.id, message });
  }
}
