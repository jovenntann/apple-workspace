import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ProductType } from '@apple/backend/dynamodb-onetable';

export class UpdateProductDto implements Partial<ProductType> {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty()
  productCategory?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty()
  productName?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  stock?: number;
}
