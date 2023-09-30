import { Module } from '@nestjs/common';
import { DynamodbOnetableModule } from '@apple/backend/dynamodb-onetable';
import { BackendServiceProductsService } from './backend-service-products.service';

@Module({
  imports: [DynamodbOnetableModule],
  providers: [BackendServiceProductsService],
  exports: [BackendServiceProductsService],
})
export class BackendServiceProductsModule {}
