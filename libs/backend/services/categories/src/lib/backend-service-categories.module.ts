import { Module } from '@nestjs/common';
import { DynamodbOnetableModule } from '@apple/backend/dynamodb-onetable';
import { BackendServiceCategoriesService } from './backend-service-categories.service';

@Module({
  imports: [DynamodbOnetableModule],
  providers: [BackendServiceCategoriesService],
  exports: [BackendServiceCategoriesService],
})
export class BackendServiceCategoriesModule {}
