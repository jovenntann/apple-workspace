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

async function testCreateProduct() {
  const productData: ProductManagementProductsCreateProduct = {
    productName: 'Test Product',
    brand: 'Test Brand',
    image: 'http://test.com/image.jpg',
    price: 100,
    stock: 50,
    is_available: true,
    categoryId: '1',
    description: 'Test Description'
  };

  const product = await createProduct(productData);
  console.log(product);
}
testCreateProduct();