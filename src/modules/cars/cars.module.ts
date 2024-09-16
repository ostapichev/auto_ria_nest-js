import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CurrencyRateModule } from '../currency-rate/currency-rate.module';
import { CarsController } from './cars.controller';
import { CarsService } from './services/cars.service';

@Module({
  imports: [AuthModule, CurrencyRateModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
