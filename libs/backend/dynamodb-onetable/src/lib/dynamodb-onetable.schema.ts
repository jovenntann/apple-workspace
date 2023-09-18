export const Schema = {
    version: '0.0.1',
    indexes: {
      primary: { hash: 'PK', sort: 'SK' },
      GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
      GSI2: { hash: 'GSI2PK', sort: 'GSI2SK' },
      GSI3: { hash: 'GSI3PK' },
      GSI4: { hash: 'GSI4PK', sort: 'GSI4SK' },
      GSI5: { hash: 'GSI5PK', sort: 'GSI5SK' },
      GSI6: { hash: 'GSI6PK' },
    },
    models: {
      Product: {
        PK: { type: String, value: 'PRODUCT' },
        // Since Product ID is in ULID format, we can use on sorting
        SK: { type: String, value: 'PRODUCT#${productId}' },
        productId: { type: String, generate: 'ulid', },
        productCategory: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        stock: { type: Number, required: true },
        // Get all the Products by Category Name
        GSI1PK: { type: String, value: 'PRODUCT' },
        GSI1SK: { type: String, value: 'PRODUCT#${productCategory}' },
        created: { type: Date, timestamp: true },
        updated: { type: Date, timestamp: true },
      },
    },
    params: {
      isoDates: true,
      timestamps: true,
    },
} as const;
