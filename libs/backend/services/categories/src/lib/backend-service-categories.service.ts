import { CreateCategoryType } from './dto/create-category.dto';
import { ReadCategoryDTO } from './dto/read-category.dto';
import { Injectable } from '@nestjs/common';
import { DynamoDbService, CategoryType } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceCategoriesService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private categoryTable: any = null;

  constructor(
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.categoryTable = this.dynamoDbService.dynamoDbMainTable().getModel('Category');
  }

  async createCategory(createCategoryType: CreateCategoryType): Promise<ReadCategoryDTO> {
    const category: CategoryType = {
      categoryName: createCategoryType.categoryName,
      description: createCategoryType.description,
    }
    const createdCategory: CategoryType = await this.categoryTable.create(category);
    return this.convertToReadCategoryDTO(createdCategory);
  }

  private async convertToReadCategoryDTO(categoryType: CategoryType): Promise<ReadCategoryDTO> {
    return {
      categoryId: categoryType.categoryId,
      categoryName: categoryType.categoryName,
      description: categoryType.description,
      created: categoryType.created,
      updated: categoryType.updated,
    };
  }
}
