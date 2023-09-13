import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Table } from 'dynamodb-onetable';
import { Dynamo } from 'dynamodb-onetable/Dynamo';

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
      schema: {
        version: '0.0.1',
        indexes: {
          primary: { hash: 'PK', sort: 'SK' },
          GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
          GSI2: { hash: 'GSI2PK', sort: 'GSI2SK' },
          GSI3: { hash: 'GSI3PK' },
          GSI4: { hash: 'GSI4PK', sort: 'GSI4SK' },
          GSI5: { hash: 'GSI5PK', sort: 'GSI5SK' },
          GSI6: { hash: 'GSI6PK' },
          GSI7: { hash: 'GSI7PK', sort: 'GSI7SK' },
          GSI8: { hash: 'GSI8PK', sort: 'GSI8SK' },
          GSI9: { hash: 'GSI9PK', sort: 'GSI9SK' },
        },
        models: {
          Product: {
            PK: { type: String, value: 'PRODUCT#${productId}' },
            SK: { type: String, value: '${productCategory}' },
            productId: { type: String, generate: 'ulid' },
            productCategory: { type: String },
            productName: { type: String },
            price: { type: Number },
            description: { type: String },
            stock: { type: Number },
            GSI1PK: { type: String, value: '${productCategory}' },
            GSI1SK: { type: String, value: '${productName}' },
          },
        },
      },
    });
  }
}
