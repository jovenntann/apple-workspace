import { Injectable, Logger } from '@nestjs/common';
import {
  DynamoDbService,
  CategoryType,
  createDynamoDbOptionWithPKSKIndex
} from '@apple/backend/dynamodb-onetable';
import { ProductManagementCategoriesCategory, ProductManagementCategoriesCategoryResponse } from '@apple/shared/contracts';

@Injectable()
export class BackendServiceCategoriesService {
  private readonly logger = new Logger(BackendServiceCategoriesService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private categoryTable: any = null;

  constructor(private readonly dynamoDbService: DynamoDbService) {
    this.categoryTable = this.dynamoDbService
      .dynamoDbMainTable()
      .getModel('Category');
    this.logger = new Logger(BackendServiceCategoriesService.name);
    this.logger.log('BackendServiceCategoriesService initialized');
  }

  async findAllCategories(query: {
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<ProductManagementCategoriesCategoryResponse> {
    this.logger.log('findAllCategories method called');

    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      query.limit,
      '', // This could be any other GSI or an empty string
      query.direction,
      query.cursorPointer,
      query.reverse
    );

    const categories = await this.categoryTable.find({}, dynamoDbOption);
    this.logger.log(`Found ${categories.length} categories`);

    const mappedCategories = categories.map(mapCategoryTypeToProductManagementCategoriesCategory);

    return {
      data: mappedCategories,
      nextCursorPointer: categories.next,
      prevCursorPointer: categories.prev
    };
  }

  // Since this function is to save a category into a database we need to ensure that the category is valid CategoryType Entity
  // Promise<Category> because this is the return requirements from the contract
  async createCategory(categoryType: CategoryType): Promise<ProductManagementCategoriesCategory> {
    this.logger.log('createCategory method called');
    const createdCategory = await this.categoryTable.create(categoryType) as CategoryType;
    this.logger.log(createdCategory);
    this.logger.log(`Category created with id ${createdCategory.categoryId}`);

    return mapCategoryTypeToProductManagementCategoriesCategory(createdCategory);
  }
}

/*
? Why do we need this? 
* Because we need to ensure that the data that we are returning is align with the contract
* This function maps the category type to the product management categories category type.
* It handles optional fields by providing default values.
*/
function mapCategoryTypeToProductManagementCategoriesCategory(category: CategoryType): ProductManagementCategoriesCategory {
  return {
    // If the category ID is not available, an empty string is used as the default value.
    categoryId: category.categoryId ?? '' ,
    categoryName: category.categoryName,
    description: category.description,
    // If the created date is not available, the current date is used as the default value.
    created: category.created ?? new Date(),
    // If the updated date is not available, the current date is used as the default value.
    updated: category.updated ?? new Date()
  };
}
