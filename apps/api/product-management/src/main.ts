import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

import { apiProduct } from '@apple/shared/contracts';
import { generateOpenApi } from '@ts-rest/open-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set Global Prefix
  const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);

  const openApiDocument = generateOpenApi(
    apiProduct,
    {
      info: {
        title: 'Product Management API',
        version: '1.0.0'
      }
    },
    {
      setOperationId: true
    }
  );

  // Create Swagger Config
  SwaggerModule.setup('docs', app, openApiDocument);

  // Define Port
  const port = process.env.PORT || 3001;

  // Listen on defined port
  await app.listen(port);

  // Log application running message
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  // Log Swagger endpoint message
  Logger.log(`🚀 Swagger UI available at: http://localhost:${port}/docs`);
}

bootstrap();
