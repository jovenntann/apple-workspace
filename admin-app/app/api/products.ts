import { initClient } from '@ts-rest/core';
import { contract } from '@apple/shared/contracts';
import { ProductManagementProductsCreateProduct } from '@apple/shared/contracts';

const productsClient = initClient(contract.productManagement.products, {
  baseUrl: 'http://localhost:3001',
  baseHeaders: {}
});

export async function getProductsByCategoryId() {
  const { body, status } = await productsClient.getProductsByCategoryId({
    params: {
      id: '10'
    }
  });

  if (status === 200) {
    console.log(body);
    return body;
  }
}

export async function createProduct(productData: ProductManagementProductsCreateProduct) {
  const { body, status } = await productsClient.createProduct({
    body: productData
  });

  if (status === 201) {
    console.log(body);
    return body;
  }
}
