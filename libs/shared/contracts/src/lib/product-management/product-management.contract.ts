import { initContract } from '@ts-rest/core';
import { products } from './products/products.contract';
import { categories } from './categories/categories.contract';


const c = initContract();

export const productManagement = c.router({
  products: products,
  categories: categories
});
