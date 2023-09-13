import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '@apple/backend/dynamodb-onetable';



export class ReadProductDto implements Partial<ProductType> {
  @ApiProperty()
  productId?: string;
  
  @ApiProperty()
  productCategory: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  stock: number;
}
