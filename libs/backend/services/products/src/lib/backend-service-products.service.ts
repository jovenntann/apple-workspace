import { CreateProductType } from './dto/create-product.dto';
import { ReadProductDTO } from './dto/read-product.dto';
import { PaginatedDataDTO } from './dto/paginated-data.dto';
import { FindProductsByDateRangeDTO } from './dto/find-products-by-date-range.dto';
import { PaginationQueryDTO } from './dto/pagination-query.dto';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDbService, ProductType, createDynamoDbOptionWithPKSKIndex } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceProductsService {
  private readonly logger = new Logger(BackendServiceProductsService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private productTable: any = null;

  constructor( 
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.productTable = this.dynamoDbService.dynamoDbMainTable().getModel('Product');
    this.logger = new Logger(BackendServiceProductsService.name);
    this.logger.log('BackendServiceProductsService initialized');
  }

  async createProduct(createProductType: CreateProductType): Promise<ReadProductDTO> {
    this.logger.log('createProduct method called');
    const product: ProductType = {
      productName: createProductType.productName,
      description: createProductType.description,
      price: createProductType.price,
      stock: createProductType.stock,
      categoryId: createProductType.categoryId,
    }
    const createdProduct: ProductType = await this.productTable.create(product);
    this.logger.log(`Product created with id: ${createdProduct.productId}`);
    return this.convertToReadProductDTO(createdProduct);
  }

  async findAllProducts(filters: PaginationQueryDTO): Promise<PaginatedDataDTO<ReadProductDTO>> {
    this.logger.log('findAllProducts method called');
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      filters.limit,
      'GSI2', // This is an example it could be any other GSI or empty string
      filters.direction,
      filters.cursorPointer,
      filters.reverse
    );
    const products = await this.productTable.find({}, dynamoDbOption);
    this.logger.log(`Found ${products.length} products`);
    const convertedProductsToDTO = await Promise.all(products.map(this.convertToReadProductDTO));
    return new PaginatedDataDTO(convertedProductsToDTO, products.next, products.prev);
  }

  async findProductsByDateRange(filters: FindProductsByDateRangeDTO): Promise<PaginatedDataDTO<ReadProductDTO>> {
    this.logger.log('findProductsByDateRange method called');
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      filters.limit,
      'GSI2', // Using GSI2 which is indexed by the created date
      filters.direction,
      filters.cursorPointer,
      filters.reverse
    );

    const products = await this.productTable.find(
      {
        'GSI2PK': 'PRODUCT', // Assuming GSI2PK is mapped to a constant 'PRODUCT' string
        'GSI2SK': { between: [filters.startDate, filters.endDate] }, // Querying products created between startDate and endDate
      },
      dynamoDbOption
    );

    this.logger.log(`Found ${products.length} products between dates`);
    const convertedProductsToDTO = await Promise.all(products.map(this.convertToReadProductDTO));
    return new PaginatedDataDTO(convertedProductsToDTO, products.next, products.prev);
  }

  private async convertToReadProductDTO(productType: ProductType): Promise<ReadProductDTO> {
    return {
      productId: productType.productId,
      productName: productType.productName,
      description: productType.description,
      price: productType.price,
      stock: productType.stock,
      categoryId: productType.categoryId,
      created: productType.created,
      updated: productType.updated,
    };
  }
}


