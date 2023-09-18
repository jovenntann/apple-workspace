import { CreateProductType } from './dto/create-product.dto';
import { ReadProductDTO } from './dto/read-product.dto';
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

  async findAllProducts(): Promise<ReadProductDTO[]> {
    const products = await this.productTable.find();
    return Promise.all(products.map(this.convertToReadProductDTO));
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
