import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import {
  BackendServiceProductsService,
  CreateProductDTO,
  ReadProductDTO,
  FindAllQueryDTO
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

  @Get()
  @ApiOkResponse({ type: [ReadProductDTO] })
  findAll(@Query() query: FindAllQueryDTO) {
    return this.backendServiceProductsService.findAllProducts(query.limit, query.direction, query.cursorPointer);
  }
}
