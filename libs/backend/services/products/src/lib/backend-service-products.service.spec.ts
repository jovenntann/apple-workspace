import { Test, TestingModule } from '@nestjs/testing';
import { BackendServiceProductsService } from './backend-service-products.service';
import { DynamoDbService } from '@apple/backend/dynamodb-onetable';
import { CreateProductDto } from './dto/create-product.dto';

// Mocking DynamoDbService from '@apple/backend/dynamodb-onetable' to isolate unit tests from external dependencies
jest.mock('@apple/backend/dynamodb-onetable');

describe('BackendServiceProductsService', () => {
  let service: BackendServiceProductsService;
  let dynamoDbService: DynamoDbService;

  beforeEach(async () => {
    // Setting up a testing module with necessary providers and mocked services
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackendServiceProductsService,
        {
          provide: DynamoDbService,
          useValue: {
            dynamoDbMainTable: jest.fn().mockReturnValue({
              getModel: jest.fn().mockReturnValue({
                create: jest.fn(),
              }),
            }),
          },
        },
      ],
    }).compile();

    // Getting instances of the services to be used in the tests
    service = module.get<BackendServiceProductsService>(BackendServiceProductsService);
    dynamoDbService = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    // Verifying if the service has been initialized properly
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      // Creating a product data transfer object to be used as input for the createProduct method
      const createProductDto: CreateProductDto = {
        productCategory: 'Electronics',
        productName: 'Phone',
        description: 'A phone',
        price: 100,
        stock: 10,
      };

      // Calling the createProduct method with the created DTO
      await service.createProduct(createProductDto);

      // Creating an expected data object with additional properties that are expected to be added by the createProduct method
      const expectedData = {
        ...createProductDto,
        SK: createProductDto.productCategory,
        GSI1PK: createProductDto.productCategory,
        GSI1SK: createProductDto.productName,
        createdDate: expect.any(String),
      };

      console.log(expectedData)

      // Verifying if the create method of the Product model has been called with the correct arguments
      expect(dynamoDbService.dynamoDbMainTable().getModel('Product').create)
        .toHaveBeenCalledWith(expectedData, { type: 'Product' });
    });
  });
});
