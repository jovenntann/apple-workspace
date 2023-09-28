import { initContract } from '@ts-rest/core';
import { productManagement } from './product-management/product-management.contract';

const c = initContract();

export const contract = c.router({
  productManagement: productManagement
});
