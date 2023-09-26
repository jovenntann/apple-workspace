import { CreateCategoryType } from './dto/create-category.dto';
import { ReadCategoryDTO } from './dto/read-category.dto';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDbService, CategoryType } from '@apple/backend/dynamodb-onetable';

@Injectable()
export class BackendServiceCategoriesService {
  private readonly logger = new Logger(BackendServiceCategoriesService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private categoryTable: any = null;

  constructor(
    private readonly dynamoDbService: DynamoDbService,
  ) {
    this.categoryTable = this.dynamoDbService.dynamoDbMainTable().getModel('Category');
    this.logger.log('BackendServiceCategoriesService initialized');
  }

  async createCategory(createCategoryType: CreateCategoryType): Promise<ReadCategoryDTO> {
    this.logger.log('createCategory method called');
    const category: CategoryType = {
      categoryName: createCategoryType.categoryName,
      description: createCategoryType.description,
    }
    const createdCategory: CategoryType = await this.categoryTable.create(category);
    this.logger.log(`Category created with id: ${createdCategory.categoryId}`);
    return this.convertToReadCategoryDTO(createdCategory);
  }

  async findAllCategories(): Promise<ReadCategoryDTO[]> {
    this.logger.log('findAllCategories method called');
    const categories = await this.categoryTable.find();
    this.logger.log(`Found ${categories.length} categories`);
    return Promise.all(categories.map(this.convertToReadCategoryDTO));
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

