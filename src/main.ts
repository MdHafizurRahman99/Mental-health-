import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix('mental-health');

  const config = new DocumentBuilder()
    .setTitle("NestJS Auth API")
    .setDescription("API documentation for NestJS authentication")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("users")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  
  SwaggerModule.setup("mental-health/api", app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()

