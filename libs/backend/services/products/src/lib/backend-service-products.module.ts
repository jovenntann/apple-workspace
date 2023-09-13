import { Module } from '@nestjs/common';
import { DynamodbOnetableModule } from '@apple/backend/dynamodb-onetable';

@Module({
  controllers: [],
  providers: [],
  exports: [DynamodbOnetableModule],
})
export class BackendServiceProductsModule {}
