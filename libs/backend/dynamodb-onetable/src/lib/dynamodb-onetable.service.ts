import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Table, Entity } from 'dynamodb-onetable';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { Schema } from './dynamodb-onetable.schema';

@Injectable()
export class DynamoDbService {
  private client: Dynamo;
  constructor(private readonly configService: ConfigService) {
    const isLocal = this.configService.get<string>('NODE_ENV') === 'development';
    const endpoint = isLocal ? 'http://localhost:8000' : undefined;
    this.client = new Dynamo({
      client: new DynamoDBClient({
        region: this.configService.get<string>('DEFAULT_REGION'),
        endpoint: endpoint,
      }),
    });
  }

  dynamoDbMainTable() {
    return new Table({
      client: this.client,
      name: this.configService.get<string>('DYNAMO_DB_MAIN_TABLE'),
      partial: true,
      schema: Schema,
    });
  }
}

export type ProductType = Entity<typeof Schema.models.Product>;
export type CategoryType = Entity<typeof Schema.models.Category>;