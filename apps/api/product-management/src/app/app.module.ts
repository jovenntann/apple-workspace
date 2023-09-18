import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { BackendServiceProductsModule } from '@apple/backend/services/products';
import { CategoriesController } from './categories/categories.controller';
import { BackendServiceCategoriesModule } from '@apple/backend/services/categories';

@Module({
  imports: [BackendServiceProductsModule, BackendServiceCategoriesModule],
  controllers: [AppController, ProductsController, CategoriesController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
