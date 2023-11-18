export const Schema = {
  version: '0.0.1',
  indexes: {
    primary: { hash: 'PK', sort: 'SK' },
    GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
    GSI2: { hash: 'GSI2PK', sort: 'GSI2SK' },
    GSI3: { hash: 'GSI3PK', sort: 'GSI3SK' },
    GSI4: { hash: 'GSI4PK', sort: 'GSI4SK' },
    GSI5: { hash: 'GSI5PK', sort: 'GSI5SK' },
    GSI6: { hash: 'GSI6PK' },
  },
  models: {
    User: {
      /* 
      ? User Access Patterns:
      * Get a user by userId: Using the primary index with PK = 'USER' and SK = '${userId}'.
      * Query users by email: Using GSI1 with GSI1PK = 'USER' and GSI1SK = '${email}'.
      */
      PK: { type: String, value: 'USER' },
      SK: { type: String, value: '${userId}' },
      GSI1PK: { type: String, value: 'USER' },
      GSI1SK: { type: String, value: '${email}' }, 
      userId: { type: String, generate: 'ulid' },
      username: { type: String, required: true },
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      created: { type: Date, timestamp: true },
      updated: { type: Date, timestamp: true },
    },
    Product: {
      /* 
      ? Product Access Patterns:
      * Get a product by productId: Using the primary index with PK = 'PRODUCT' and SK = '${productId}'.
      * Query all products by category ID: Using GSI1 with GSI1PK = 'PRODUCT' and GSI1SK = 'CATEGORY#${categoryId}'.
      * Query all products between date ranges: Using GSI2 with GSI2PK = 'PRODUCT' and GSI2SK between the desired date range.
      */
      PK: { type: String, value: 'PRODUCT' },
      SK: { type: String, value: '${productId}' },
      GSI1PK: { type: String, value: 'PRODUCT' },
      GSI1SK: { type: String, value: 'CATEGORY#${categoryId}' }, 
      GSI2PK: { type: String, value: 'PRODUCT' },
      GSI2SK: { type: Date, value: '${created}' }, 
      productId: { type: String, generate: 'ulid' },
      productName: { type: String, required: true },
      brand: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String },
      stock: { type: Number, required: true },
      isAvailable: { type: Boolean, required: true },
      created: { type: Date, timestamp: true },
      updated: { type: Date, timestamp: true },
      categoryId: { type: String, required: true },
    },
    Category: {
      /* 
      ? Category Access Patterns:
      * Get a category by categoryId: Using the primary index with PK = 'CATEGORY' and SK = '${categoryId}'.
      * Query categories by name: Using GSI1 with GSI1PK = 'CATEGORY' and GSI1SK = '${categoryName}'.
      */
      PK: { type: String, value: 'CATEGORY' },
      SK: { type: String, value: '${categoryId}' },
      GSI1PK: { type: String, value: 'CATEGORY' },
      GSI1SK: { type: String, value: '${categoryName}' }, 
      categoryId: { type: String, generate: 'ulid', },
      categoryName: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      created: { type: Date, timestamp: true },
      updated: { type: Date, timestamp: true },
    },
  },
  params: {
    isoDates: true,
    timestamps: true,
  },
} as const;
