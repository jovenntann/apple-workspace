import { CreateProductType } from './dto/create-product.dto';
import { ReadProductDTO } from './dto/read-product.dto';
import { PaginatedDataDTO } from './dto/paginated-data.dto';
import { Injectable } from '@nestjs/common';
import { DynamoDbService, ProductType, createDynamoDbOptionWithPKSKIndex } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceProductsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private productTable: any = null;

  constructor( 
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.productTable = this.dynamoDbService.dynamoDbMainTable().getModel('Product');
  }

  async createProduct(createProductType: CreateProductType): Promise<ReadProductDTO> {
    const product: ProductType = {
      productName: createProductType.productName,
      description: createProductType.description,
      price: createProductType.price,
      stock: createProductType.stock,
      categoryId: createProductType.categoryId,
    }
    const createdProduct: ProductType = await this.productTable.create(product);
    return this.convertToReadProductDTO(createdProduct);
  }

  async findAllProducts(
    limit: number,
    direction: string,
    cursorPointer: string
  ): Promise<PaginatedDataDTO<ReadProductDTO>> {
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      limit,
      'GSI1', // This is an example it could be any other GSI or empty string
      direction,
      cursorPointer
    );
    const products = await this.productTable.find({}, dynamoDbOption);
    const convertedProductsToDTO = await Promise.all(products.map(this.convertToReadProductDTO));
    return new PaginatedDataDTO(convertedProductsToDTO, products.next, products.prev);
  }

  async findProductsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number,
    direction: string,
    cursorPointer?: string
  ): Promise<PaginatedDataDTO<ReadProductDTO>> {
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      limit,
      'GSI2', // Using GSI2 which is indexed by the created date
      direction,
      cursorPointer
    );

    const products = await this.productTable.find(
      {
        'GSI2PK': 'PRODUCT', // Assuming GSI2PK is mapped to a constant 'PRODUCT' string
        'GSI2SK': { between: [startDate, endDate] }, // Querying products created between startDate and endDate
      },
      dynamoDbOption
    );

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
