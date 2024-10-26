import { Module } from '@nestjs/common';

import { SocketService } from './services/socket.service';
import { SocketController } from './socket.controller';

@Module({
  providers: [SocketService],
  controllers: [SocketController],
})
export class SocketModule {}
