import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import {
  BackendServiceCategoriesService,
  CreateCategoryDTO,
  ReadCategoryDTO,
} from '@apple/backend/services/categories';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
export class CategoriesController {
  constructor(
    private readonly backendServiceCategoriesService: BackendServiceCategoriesService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ReadCategoryDTO })
  create(@Body() createCategoryDto: CreateCategoryDTO) {
    return this.backendServiceCategoriesService.createCategory(createCategoryDto);
  }
}
