import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config, PostgresConfig } from '../../config/config.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService<Config>) => {
        const config = configService.get<PostgresConfig>('postgres');
        return {
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.password,
          database: config.dbName,
          entities: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'entities',
              '*.entity.js',
            ),
          ],
          migrations: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'migrations',
              '*.js',
            ),
          ],
          migrationsRun: true,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
