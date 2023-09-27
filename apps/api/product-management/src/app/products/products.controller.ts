import { Controller } from '@nestjs/common';
import { apiProduct } from '@apple/shared/contracts';
import {
  TsRestHandler,
  tsRestHandler
} from '@ts-rest/nest';

import { BackendServiceProductsService } from '@apple/backend/services/products';

@Controller()
export class ProductsController {
  constructor(
    private readonly backendServiceProductsService: BackendServiceProductsService
  ) {}

  @TsRestHandler(apiProduct)
  async handler() {
    return tsRestHandler(apiProduct, {
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
      }
    });
  }
}

// @TsRest(contract.findAllProducts)
// async getPosts(
//   @TsRestRequest()
//   request: RequestShapes['findAllProducts']
// ) {
//   const limit = request.query.limit;
//   const reverse = request.query?.reverse;
//   const cursorPointer = request.query?.cursorPointer;
//   const direction = request.query?.direction;

//   const { data, nextCursorPointer, prevCursorPointer } = await this.backendServiceProductsService.findAllProducts({
//     limit,
//     reverse,
//     cursorPointer,
//     direction
//   });

//   return {
//     status: 200,
//     body: { data, nextCursorPointer, prevCursorPointer },
//   };
// }

// @Controller('products')
// @ApiTags('products')
// @ApiBearerAuth('JWT-auth')
// export class ProductsController {
//   constructor(
//     private readonly backendServiceProductsService: BackendServiceProductsService,
//   ) {}

//   @Post()
//   @ApiCreatedResponse({ type: ReadProductDTO })
//   create(@Body() createProductDto: CreateProductDTO) {
//     return this.backendServiceProductsService.createProduct(createProductDto);
//   }

//   @Get()
//   @ApiOkResponse({ type: ReadProductsDTO })
//   findAll(@Query(new ValidationPipe({ transform: true })) query: PaginationQueryDTO) {
//     return this.backendServiceProductsService.findAllProducts(query);
//   }

//   @Get('by-date-range')
//   @ApiOkResponse({ type: ReadProductsDTO })
//   findByDateRange(@Query(new ValidationPipe({ transform: true })) query: FindProductsByDateRangeDTO) {
//     return this.backendServiceProductsService.findProductsByDateRange(query);
//   }
// }
