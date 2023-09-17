import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import {
  BackendServiceProductsService,
  CreateProductDTO,
  ReadProductDTO,
} from '@apple/backend/services/products';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(
    private readonly backendServiceProductsService: BackendServiceProductsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ReadProductDTO })
  create(@Body() createProductDto: CreateProductDTO) {
    return this.backendServiceProductsService.createProduct(createProductDto);
  }
}
