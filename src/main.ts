import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix('mental-health');
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const config = new DocumentBuilder()
    .setTitle("NestJS Auth API")
    .setDescription("API documentation for NestJS authentication")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("users")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  
  // SwaggerModule.setup("mental-health/api", app, document);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()

