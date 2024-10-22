import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { GlobalExceptionFilter } from '../common';
import configuration from '../config/configuration';
import { AdminPanelModule } from './admin-panel/admin_panel.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { ChatModule } from './chat/chat.module';
import { CronModule } from './cron/cron.module';
import { CurrencyRateModule } from './currency-rate/currency-rate.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { LoggerModule } from './logger/logger.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';
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
    ScheduleModule.forRoot(),
    AdminPanelModule,
    AuthModule,
    CarsModule,
    PostgresModule,
    UsersModule,
    LoggerModule,
    RepositoryModule,
    RedisModule,
    FileStorageModule,
    ChatModule,
    CurrencyRateModule,
    MailSenderModule,
    CronModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
