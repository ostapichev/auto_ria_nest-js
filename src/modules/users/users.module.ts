import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersService } from './services';
import { UsersController } from './users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), FileStorageModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
