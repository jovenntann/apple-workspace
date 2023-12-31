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
      getAllProducts: async ({ query }) => {
        const { data, nextCursorPointer, prevCursorPointer } =
          await this.backendServiceProductsService.getAllProducts({
            limit: query.limit,
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },

      // * This creates important role on typesafety between the contract and database schema
      // * because this will ensure that the contract BaseSchema would follow the required fields from the database schema
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
            limit: query.limit,
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },

      getProductById: async ({ params }) => {
        const product = await this.backendServiceProductsService.getProductById(
          params.id
        );
        return {
          status: 200,
          body: product
        };
      },

      getProductsByCategoryId: async ({ params }) => {
        const products = await this.backendServiceProductsService.getProductsByCategoryId(
          params.id
        );
        return {
          status: 200,
          body: products
        };
      },

    });
  }
}

