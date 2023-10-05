import { initClient } from '@ts-rest/core';
import { contract } from '@apple/shared/contracts';
import { ProductManagementCategoriesCreateCategory } from '@apple/shared/contracts';

const categoriesClient = initClient(contract.productManagement.categories, {
  baseUrl: 'http://localhost:3001',
  baseHeaders: {}
});

export async function getCategories() {
  const { body, status } = await categoriesClient.findAllCategories();

  if (status === 200) {
    console.log(body);
    return body;
  }
}

export async function createCategory(categoryData: ProductManagementCategoriesCreateCategory) {
  const { body, status } = await categoriesClient.createCategory({
    body: categoryData
  });

  if (status === 201) {
    console.log(body);
    return body.title;
  }
}

async function testCreateCategory() {
  const categoryData: ProductManagementCategoriesCreateCategory = {
    categoryName: 'Test Category',
    title: 'Test Title',
    description: 'Test Description'
  };

  const category = await createCategory(categoryData);
  console.log(category);
}
testCreateCategory();
