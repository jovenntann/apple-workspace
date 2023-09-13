import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DynamoDbService } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceProductsService {
  private productTable: any = null;

  constructor(
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.productTable = this.dynamoDbService.dynamoDbMainTable().getModel('Product');
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const currentTimestamp = new Date().toISOString();
    await this.productTable.create({
      ...createProductDto,
      SK: createProductDto.productCategory,
      GSI1PK: createProductDto.productCategory,
      GSI1SK: createProductDto.productName,
      createdDate: currentTimestamp,
    }, { type: 'Product' });
  }

  private async convertToDto(record: any): Promise<any> {
    return {
      productId: record.productId,
      productCategory: record.productCategory,
      productName: record.productName,
    };
  }
}
