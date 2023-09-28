import { initContract } from '@ts-rest/core';
import { productContract } from './products/products.contract';

const c = initContract();

export const productManagementContract = c.router({
  productContract: productContract
});
