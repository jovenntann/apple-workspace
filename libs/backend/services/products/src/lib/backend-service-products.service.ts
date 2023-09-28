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

    return {
      data: products,
      nextCursorPointer: products.next,
      prevCursorPointer: products.prev
    };
  }

  // Since this function is to save a product into a database we need to ensure that the product is valid ProductType Entity
  // Promise<Product> because this is the return requirements from the contract
  async createProduct(productType: ProductType): Promise<Product> {
    this.logger.log('createProduct method called');
    const createdProduct = await this.productTable.create(productType);
    this.logger.log(createdProduct);
    this.logger.log(`Product created with id ${createdProduct.productId}`);

    return createdProduct;
  }

  async getProductsByDateRange(query: {
    startDate: Date;
    endDate: Date;
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<ProductResponse> {
    this.logger.log('getProductsByDateRange method called');

    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      query.limit,
      'GSI2', // This is an example it could be any other GSI or empty string
      query.direction,
      query.cursorPointer,
      query.reverse
    );

    const products = await this.productTable.find(
      {
        GSI2PK: 'PRODUCT',
        GSI2SK: { between: [query.startDate, query.endDate] }
      },
      dynamoDbOption
    );

    this.logger.log(`Found ${products.length} products`);

    return {
      data: products,
      nextCursorPointer: products.next,
      prevCursorPointer: products.prev
    };
  }

  // private async convertToProduct(productType: ProductType): Promise<Product> {
  //   return {
  //     productId: productType.productId || '',
  //     productName: productType.productName,
  //     description: productType.description,
  //     price: productType.price,
  //     stock: productType.stock,
  //     categoryId: productType.categoryId,
  //     created: productType.created,
  //     updated: productType.updated
  //   };
  // }
}
