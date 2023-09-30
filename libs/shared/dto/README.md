# shared-dto

This library was generated with [Nx](https://nx.dev).

### Building

Run `nx build shared-dto` to build the library.

### Running unit tests

Run `nx test shared-dto` to execute the unit tests via [Jest](https://jestjs.io).

### Shared DTO Library for Products in Nx Workspace

For a shared DTO library related to products in an Nx workspace, you'd typically organize the folder structure in a modular and logical manner. 

## Folder Structure

```
/libs
|--/shared-dto
|--/src
|--/lib
|--/products
|--/models
|-- product.dto.ts
|-- product-category.dto.ts
|-- product-variant.dto.ts
...
|--/interfaces
|-- product.interface.ts
...
|--/enums
|-- product-status.enum.ts
...
|--/validators
|-- product.validator.ts
...
|--/utils
|-- dto-utils.ts
|-- index.ts
```

## Components Breakdown

- **models**: This folder contains the main DTOs. For products, you'd have DTOs like `product.dto.ts`, `product-category.dto.ts`, and maybe even variants like `product-variant.dto.ts`.
  
- **interfaces**: If you need interfaces (for services or other objects) that are directly related to your DTOs, they can go here.
  
- **enums**: Enums related to products, like product statuses (`product-status.enum.ts`), can be organized here.
  
- **validators**: If there are any validation logic or functions specifically tailored for product DTOs, you can place them here. This might include functions that validate product data before it's sent to the backend.
  
- **utils**: General utilities related to DTOs, but not specific to products, can be placed here. This folder can house helper functions and utilities that can be used across various DTOs.
  
- **index.ts**: This is the main entry point for the library. Here, you'd export all the DTOs, interfaces, enums, validators, and utilities so that they can be easily imported by other libraries or applications in the workspace.

## Best Practices

When using this structure, it's crucial to keep it clean and modular. As the project grows, you might find a need to further modularize the folder structure or introduce more categories. The primary goal is to ensure that the DTOs and related entities are organized logically and are easy to locate and maintain.