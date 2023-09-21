import { CreateProductType } from './dto/create-product.dto';
import { ReadProductDTO } from './dto/read-product.dto';
import { PaginatedDataDTO } from './dto/paginated-data.dto';
import { FindProductsByDateRangeDTO } from './dto/find-products-by-date-range.dto';
import { PaginationQueryDTO } from './dto/pagination-query.dto';
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

  async findAllProducts(filters: PaginationQueryDTO): Promise<PaginatedDataDTO<ReadProductDTO>> {
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      filters.limit,
      'GSI2', // This is an example it could be any other GSI or empty string
      filters.direction,
      filters.cursorPointer,
      filters.reverse
    );
    console.log(dynamoDbOption)
    const products = await this.productTable.find({}, dynamoDbOption);
    const convertedProductsToDTO = await Promise.all(products.map(this.convertToReadProductDTO));
    return new PaginatedDataDTO(convertedProductsToDTO, products.next, products.prev);
  }

  async findProductsByDateRange(filters: FindProductsByDateRangeDTO): Promise<PaginatedDataDTO<ReadProductDTO>> {
    console.log(filters.reverse);
    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      filters.limit,
      'GSI2', // Using GSI2 which is indexed by the created date
      filters.direction,
      filters.cursorPointer,
      filters.reverse
    );

    console.log(dynamoDbOption)

    const products = await this.productTable.find(
      {
        'GSI2PK': 'PRODUCT', // Assuming GSI2PK is mapped to a constant 'PRODUCT' string
        'GSI2SK': { between: [filters.startDate, filters.endDate] }, // Querying products created between startDate and endDate
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
