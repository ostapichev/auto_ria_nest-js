import { Global, Module } from '@nestjs/common';

import { BrandRepository } from './services/brand.repository';
import { CarRepository } from './services/car.repository';
import { CarViewsRepository } from './services/car-viwes.repository';
import { CityRepository } from './services/city.repository';
import { ModelRepository } from './services/model.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  CarRepository,
  CarViewsRepository,
  CityRepository,
  BrandRepository,
  ModelRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
