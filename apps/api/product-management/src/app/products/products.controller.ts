import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import {
  BackendServiceProductsService,
  CreateProductDto,
  ReadProductDto
} from '@apple/backend/services/products';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(
    private readonly backendServiceProductsService: BackendServiceProductsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ReadProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.backendServiceProductsService.createProduct(createProductDto);
  }
}
