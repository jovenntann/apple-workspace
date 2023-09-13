import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDbService } from './dynamodb-onetable.service';

@Module({
  providers: [DynamoDbService, ConfigService],
  exports: [DynamoDbService],
})
export class DynamodbOnetableModule {}
