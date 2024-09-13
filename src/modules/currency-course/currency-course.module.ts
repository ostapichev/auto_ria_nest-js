import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrencyCourseController } from './currency-course.controller';
import { CurrencyCourseService } from './services/currency-course.service';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyCourseController],
  providers: [CurrencyCourseService],
})
export class CurrencyCourseModule {}
