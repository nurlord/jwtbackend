import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import appRootPath from 'app-root-path';
import { join } from 'path';
import serveIndex from 'serve-index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const uploadsPath = join(appRootPath.path, 'uploads');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use('/uploads', express.static(uploadsPath));
  app.use('/uploads', serveIndex(uploadsPath, { icons: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ApiDocs')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, documentFactory);
  await app.listen(5000);
}
bootstrap();
