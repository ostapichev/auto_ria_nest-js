import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { RepositoryModule } from '../repository/repository.module';
import { SuperUserService } from './services/super-user.service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), FileStorageModule, RepositoryModule],
  controllers: [UsersController],
  providers: [UsersService, SuperUserService],
  exports: [UsersService],
})
export class UsersModule {}
