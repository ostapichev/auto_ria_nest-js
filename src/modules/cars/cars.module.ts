import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CurrencyRateModule } from '../currency-rate/currency-rate.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { CarsController } from './cars.controller';
import { CarsService } from './services/cars.service';

@Module({
  imports: [
    AuthModule,
    CurrencyRateModule,
    MailSenderModule,
    FileStorageModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
