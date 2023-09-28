import { initContract } from '@ts-rest/core';
import { apiProduct } from './products/product.contract';

const c = initContract();

export const contract = c.router({
  products: apiProduct,
});