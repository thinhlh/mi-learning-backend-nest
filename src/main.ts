import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomExceptionFilter } from './config/filters/custom-exception.filter';
import { ErrorResponseInterceptor } from './config/interceptors/error-response.interceptor';
import { ResponseTransformInterceptor } from './config/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await appConfig(app);

  await app.listen(8080);
}

async function appConfig(app: INestApplication) {
  app.setGlobalPrefix("/api")
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
    new ErrorResponseInterceptor()
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Automatically transform to desired type
  }))

  swaggerConfig(app);

}

async function swaggerConfig(app: INestApplication) {
  const swaggerOption = new DocumentBuilder()
    .setTitle("Resumind API")
    .setDescription("Resumind API documentation")
    .setVersion("1.0.0")
    .setContact("Hoang Thinh", "www.hoangthinh.me", "thinhlh0812@gmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOption);

  SwaggerModule.setup('/api/docs', app, document);
}
bootstrap();
