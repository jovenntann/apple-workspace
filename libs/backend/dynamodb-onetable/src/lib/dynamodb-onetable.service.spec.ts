import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from './dynamodb-onetable.service';
// import { DynamoDBClient } from '@aws-sdk/client-dynamodb'; // Removed this import
import { ConfigService } from '@nestjs/config';
import { Table } from 'dynamodb-onetable';

jest.mock('@nestjs/config');
// jest.mock('@aws-sdk/client-dynamodb'); // Removed this mock
jest.mock('dynamodb-onetable');

describe('DynamoDbService', () => {
  let service: DynamoDbService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockTable: jest.Mocked<typeof Table>;

  beforeEach(async () => {
    mockConfigService = new ConfigService() as jest.Mocked<ConfigService>;
    mockTable = Table as jest.Mocked<typeof Table>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dynamoDbMainTable', () => {
    it('should create a new Table instance with the correct parameters', () => {
      const dynamoDBMainTableName = 'testTableName';
      mockConfigService.get.mockReturnValue(dynamoDBMainTableName);

      service.dynamoDbMainTable();

      expect(mockTable).toHaveBeenCalledWith(expect.objectContaining({ name: dynamoDBMainTableName }));
    });
  });
});
