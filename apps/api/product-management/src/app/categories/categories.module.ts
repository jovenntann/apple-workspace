import { Module } from '@nestjs/common';
import { BackendServiceCategoriesModule } from '@apple/backend/services/categories';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [BackendServiceCategoriesModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}