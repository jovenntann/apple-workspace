import { Module } from '@nestjs/common';
import { BackendServiceProductsModule } from '@apple/backend/services/products';
import { ProductsController } from './products.controller';

@Module({
  imports: [BackendServiceProductsModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
