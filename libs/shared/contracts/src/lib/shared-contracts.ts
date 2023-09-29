import { initContract } from '@ts-rest/core';
import { productManagement } from './product-management/product-management.contract';
import { userManagement } from './user-management/user-management.contract';

const c = initContract();

export const contract = c.router({
  productManagement: productManagement,
  userManagement: userManagement
});