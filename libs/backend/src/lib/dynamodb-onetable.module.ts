import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamodb-onetable.service';

@Module({
  controllers: [],
  providers: [DynamoDbService],
  exports: [DynamoDbService],
})
export class DynamodbOnetableModule {}
