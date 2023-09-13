import { Test, TestingModule } from '@nestjs/testing';
import { BackendServiceProductsService } from './backend-service-products.service';
import { DynamoDbService, ProductType } from '@apple/backend/dynamodb-onetable';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';

jest.mock('@apple/backend/dynamodb-onetable');

describe('BackendServiceProductsService', () => {
  let service: BackendServiceProductsService;
  let dynamoDbService: DynamoDbService;

  beforeEach(async () => {
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

    service = module.get<BackendServiceProductsService>(BackendServiceProductsService);
    dynamoDbService = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        productCategory: 'Electronics',
        productName: 'Phone',
        description: 'A phone',
        price: 100,
        stock: 10,
      };

      const expectedProductType: ProductType = {
        productName: createProductDto.productName,
        productCategory: createProductDto.productCategory,
        description: 'A phone',
        price: 100,
        stock: 10,
        SK: createProductDto.productCategory,
        GSI1PK: createProductDto.productCategory,
        GSI1SK: createProductDto.productName,
      };

      jest.spyOn(dynamoDbService.dynamoDbMainTable().getModel('Product'), 'create')
        .mockResolvedValue(expectedProductType);

      const readProductDto: ReadProductDto = {
        productId: undefined,
        productName: createProductDto.productName,
        productCategory: createProductDto.productCategory,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      };

      const result = await service.createProduct(createProductDto);
      expect(result).toEqual(readProductDto);

      expect(dynamoDbService.dynamoDbMainTable().getModel('Product').create)
        .toHaveBeenCalledWith(expectedProductType);
    });
  });
});
