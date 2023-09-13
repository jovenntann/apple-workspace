import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { Injectable } from '@nestjs/common';
import { DynamoDbService, ProductType } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceProductsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private productTable: any = null;

  constructor(
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.productTable = this.dynamoDbService.dynamoDbMainTable().getModel('Product');
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ReadProductDto> {
    const product: ProductType = {
      productName: createProductDto.productName,
      productCategory: createProductDto.productCategory,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      SK: createProductDto.productCategory,
      GSI1PK: createProductDto.productCategory,
      GSI1SK: createProductDto.productName,
    }
    const createdProduct: ProductType = await this.productTable.create(product);
    return this.convertToDto(createdProduct);
  }

  private async convertToDto(productType: ProductType): Promise<ReadProductDto> {
    return {
      productId: productType.productId,
      productName: productType.productName,
      productCategory: productType.productCategory,
      description: productType.description,
      price: productType.price,
      stock: productType.stock,
    };
  }
}
