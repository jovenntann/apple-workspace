import { Injectable, Logger } from '@nestjs/common';
import {
  DynamoDbService,
  ProductType,
  createDynamoDbOptionWithPKSKIndex
} from '@apple/backend/dynamodb-onetable';
import { ProductManagementProductsProduct, ProductManagementProductsProductResponse } from '@apple/shared/contracts';

/*
* When passing thru the services data going in should be in Database Schema if its creating a record
* Services should be responsible for mapping the data from Database Schema to API Contract Schema
? This would ensure type safety from Database Schema to API Contract Schema
* When passing thru the services data going out should be in API Contract Schema (This would ensure the return is align with the contract)
*/

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

  async getAllProducts(query: {
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<ProductManagementProductsProductResponse> {
    this.logger.log('getAllProducts method called');

    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      query.limit,
      'GSI2', // This is an example it could be any other GSI or empty string
      query.direction,
      query.cursorPointer,
      query.reverse
    );

    const products = await this.productTable.find({}, dynamoDbOption);
    this.logger.log(`Found ${products.length} products`);

    // * This will give us flexibility on what are the fields that we want to return
    const mappedProducts = products.map(mapProductTypeToProductManagementProductsProduct);
      
    return {
      data: mappedProducts,
      nextCursorPointer: products.next,
      prevCursorPointer: products.prev
    };
  }

  // Since this function is to save a product into a database we need to ensure that the product is valid ProductType Entity
  // Promise<Product> because this is the return requirements from the contract
  async createProduct(productType: ProductType): Promise<ProductManagementProductsProduct> {
    this.logger.log('createProduct method called');
    const createdProduct = await this.productTable.create(productType) as ProductType;
    this.logger.log(createdProduct);
    this.logger.log(`Product created with id ${createdProduct.productId}`);

    // This will give us type safety from productType (Database) to ProductManagementProductsProduct (API Response / Contract)
    return mapProductTypeToProductManagementProductsProduct(createdProduct);
  }

  async getProductsByDateRange(query: {
    startDate: Date;
    endDate: Date;
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<ProductManagementProductsProductResponse> {
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

    const mappedProducts = products.map(mapProductTypeToProductManagementProductsProduct);

    return {
      data: mappedProducts,
      nextCursorPointer: products.next,
      prevCursorPointer: products.prev
    };
  }

  async getProductById(productId: string): Promise<ProductManagementProductsProduct> {
    this.logger.log('getProductById method called');
    const product = await this.productTable.get({ productId }) as ProductType;
    this.logger.log(`Found product with id ${product.productId}`);
    
    // This will give us type safety from productType (Database) to ProductManagementProductsProduct (API Response / Contract)
    return mapProductTypeToProductManagementProductsProduct(product);
  }

  async getProductsByCategoryId(categoryId: string): Promise<ProductManagementProductsProduct[]> {
    this.logger.log('getProductsByCategoryId method called');
    const products = await this.productTable.find(
      {
        GSI1PK: 'PRODUCT',
        GSI1SK: `CATEGORY#${categoryId}`
      }
    ) as ProductType[];

    // This will give us type safety from productType (Database) to ProductManagementProductsProduct (API Response / Contract)
    const mappedProducts = products.map(mapProductTypeToProductManagementProductsProduct);

    this.logger.log(`Found ${products.length} products for category id ${categoryId}`);
    return mappedProducts;
  }
}

/*
? Why do we need this? 
* Because we need to ensure that the data that we are returning is align with the contract
* This function maps the product type to the product management products product type.
* It handles optional fields by providing default values.
*/
function mapProductTypeToProductManagementProductsProduct(product: ProductType): ProductManagementProductsProduct {
  return {
    // If the product ID is not available, an empty string is used as the default value.
    productId: product.productId ?? '' ,
    productName: product.productName,
    brand: product.brand,
    image: product.image,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
    // If the created date is not available, the current date is used as the default value.
    created: product.created ?? new Date(),
    // If the updated date is not available, the current date is used as the default value.
    updated: product.updated ?? new Date()
  };
}