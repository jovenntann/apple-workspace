import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ProductType } from '@apple/backend/dynamodb-onetable'; // Adjust the import path accordingly

export class CreateProductDto implements Partial<ProductType> {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  productCategory: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  stock: number;
}
