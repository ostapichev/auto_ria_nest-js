import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CarsController } from './cars.controller';
import { CarsService } from './services/cars.service';

@Module({
  imports: [HttpModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
