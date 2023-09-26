import { Injectable, Logger } from '@nestjs/common';
import {
  DynamoDbService,
  ProductType,
  createDynamoDbOptionWithPKSKIndex
} from '@apple/backend/dynamodb-onetable';
import { Product, ProductResponse } from '@apple/shared/contracts';

@Injectable()
export class BackendServiceProductsService {
  private readonly logger = new Logger(BackendServiceProductsService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private productTable: any = null;

  constructor(private readonly dynamoDbService: DynamoDbService) {
    this.productTable = this.dynamoDbService
      .dynamoDbMainTable()
      .getModel('Product');
    this.logger = new Logger(BackendServiceProductsService.name);
    this.logger.log('BackendServiceProductsService initialized');
  }

  async findAllProducts(query: {
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<ProductResponse> {
    this.logger.log('findAllProducts method called');

    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      query.limit,
      'GSI2', // This is an example it could be any other GSI or empty string
      query.direction,
      query.cursorPointer,
      query.reverse
    );

    const products = await this.productTable.find({}, dynamoDbOption);
    this.logger.log(`Found ${products.length} products`);

    const convertedProducts = await Promise.all(
      products.map(this.convertToProduct)
    );

    return {
      data: convertedProducts,
      nextCursorPointer: products.next,
      prevCursorPointer: products.prev
    };
  }

  private async convertToProduct(productType: ProductType): Promise<Product> {
    return {
      productId: productType.productId,
      productName: productType.productName,
      description: productType.description,
      price: productType.price,
      stock: productType.stock,
      categoryId: productType.categoryId,
      created: productType.created,
      updated: productType.updated
    };
  }
}
