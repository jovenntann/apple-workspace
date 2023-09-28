import { initContract } from '@ts-rest/core';
import { products } from './products/products.contract';

const c = initContract();

export const productManagement = c.router({
  products: products
});
