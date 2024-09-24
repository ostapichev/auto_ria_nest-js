import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfig } from './config';
import { AppModule } from './modules/app.module';
import { SuperUserService } from './modules/users/services/super-user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const config = new DocumentBuilder()
    .setTitle('Auto ria: cars')
    .setDescription('The API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(appConfig.port, async () => {
    const superuser = app.get<SuperUserService>(SuperUserService);
    await superuser.createSuperUser();
    Logger.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
