import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from '../common/http/global-exception.filter';
import configuration from '../config/configuration';
import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { LoggerModule } from './logger/logger.module';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    PostgresModule,
    UsersModule,
    LoggerModule,
    RepositoryModule,
    RedisModule,
    FileStorageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
