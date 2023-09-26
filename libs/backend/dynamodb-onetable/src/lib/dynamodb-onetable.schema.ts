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
    Product: {
      PK: { type: String, value: 'PRODUCT' },
      SK: { type: String, value: '${productId}' },
      GSI1PK: { type: String, value: 'PRODUCT' },
      GSI1SK: { type: String, value: 'CATEGORY#${categoryId}' }, // To query all Products by Category ID and #CATEGORY would help on easily identifying that this is a category
      GSI2PK: { type: String, value: 'PRODUCT' },
      GSI2SK: { type: Date, value: '${created}' }, // To query all products between date ranges
      productId: { type: String, generate: 'ulid', required: true },
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String },
      stock: { type: Number, required: true },
      created: { type: Date, timestamp: true, required: true },
      updated: { type: Date, timestamp: true, required: true },
      categoryId: { type: String, required: true },
    },
    Category: {
      PK: { type: String, value: 'CATEGORY' },
      SK: { type: String, value: '${categoryId}' },
      GSI1PK: { type: String, value: 'CATEGORY' },
      GSI1SK: { type: String, value: '${categoryName}' }, // To query categories by name
      categoryId: { type: String, generate: 'ulid', },
      categoryName: { type: String, required: true },
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
