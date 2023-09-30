import { Controller } from '@nestjs/common';
import { contract } from '@apple/shared/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { BackendServiceCategoriesService } from '@apple/backend/services/categories';

@Controller()
export class CategoriesController {
  constructor(
    private readonly backendServiceCategoriesService: BackendServiceCategoriesService
  ) {}

  @TsRestHandler(contract.productManagement.categories)
  async handler() {
    return tsRestHandler(contract.productManagement.categories, {
      findAllCategories: async ({ query }) => {
        const { data, nextCursorPointer, prevCursorPointer } =
          await this.backendServiceCategoriesService.findAllCategories({
            limit:query.limit,
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },

      createCategory: async ({ body }) => {
        const category = await this.backendServiceCategoriesService.createCategory(
          body
        );
        return {
          status: 201,
          body: category
        };
      },
    });
  }
}

