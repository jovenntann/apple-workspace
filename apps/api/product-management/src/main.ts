import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod'
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Use Validation Pipe globally
  app.useGlobalPipes(new ValidationPipe());
  
  // Set Global Prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Product Management API')
    .setDescription('Product management')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  // NestJS/Zod Patch
  patchNestJsSwagger()
  
  // Create Swagger Document
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger Module
  SwaggerModule.setup('docs', app, document);
  
  // Define Port
  const port = process.env.PORT || 3001;
  
  // Listen on defined port
  await app.listen(port);
  
  // Log application running message
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  
  // Log Swagger endpoint message
  Logger.log(`🚀 Swagger UI available at: http://localhost:${port}/docs`);
}

bootstrap();
