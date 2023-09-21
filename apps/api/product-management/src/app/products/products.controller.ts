import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import {
  BackendServiceProductsService,
  CreateProductDTO,
  ReadProductDTO,
  ReadProductsDTO,
  PaginationQueryDTO,
  FindProductsByDateRangeDTO
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
  @ApiOkResponse({ type: ReadProductsDTO })
  findAll(@Query(new ValidationPipe({ transform: true })) query: PaginationQueryDTO) {
    return this.backendServiceProductsService.findAllProducts(query);
  }

  @Get('by-date-range')
  @ApiOkResponse({ type: ReadProductsDTO })
  findByDateRange(@Query(new ValidationPipe({ transform: true })) query: FindProductsByDateRangeDTO) {
    return this.backendServiceProductsService.findProductsByDateRange(query);
  }
}
