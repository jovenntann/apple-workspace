import { Controller } from '@nestjs/common';
import { contract } from '@apple/shared/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { BackendServiceProductsService } from '@apple/backend/services/products';

@Controller()
export class ProductsController {
  constructor(
    private readonly backendServiceProductsService: BackendServiceProductsService
  ) {}

  @TsRestHandler(contract.productManagement.products)
  async handler() {
    return tsRestHandler(contract.productManagement.products, {
      findAllProducts: async ({ query }) => {
        const { data, nextCursorPointer, prevCursorPointer } =
          await this.backendServiceProductsService.findAllProducts({
            limit: Number(query.limit),
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },

      createProduct: async ({ body }) => {
        const product = await this.backendServiceProductsService.createProduct(
          body
        );
        return {
          status: 201,
          body: product
        };
      },

      getProductsByDateRange: async ({ query }) => {
        const { data, nextCursorPointer, prevCursorPointer } =
          await this.backendServiceProductsService.getProductsByDateRange({
            startDate: query.startDate,
            endDate: query.endDate,
            limit: Number(query.limit),
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },
    });
  }
}

