import { initContract } from '@ts-rest/core';
import { productManagementContract } from './product-management/product-management.contract';

const c = initContract();

export const contract = c.router({
  productManagementContract: productManagementContract
});
