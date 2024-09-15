import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CurrencyCourseModule } from '../currency-course/currency-course.module';
import { CarsController } from './cars.controller';
import { CarsService } from './services/cars.service';

@Module({
  imports: [AuthModule, CurrencyCourseModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
