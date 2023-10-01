import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { PaginateQuerySchema } from '../../utils/paginate-query.schema';
import { ErrorResponseSchema } from '../../utils/error-response.schema';

export type UserManagementUsersUser = z.infer<typeof UserManagementUsersUserSchema>;
export type UserManagementUsersCreateUser = z.infer<typeof UserManagementUsersCreateUserSchema>;
export type UserManagementUsersUserResponse = z.infer<typeof UserManagementUsersUserResponseSchema>;

const BaseUserSchema = z.object({
  username: z.string(),
  email: z.string(),
});

const UserManagementUsersUserSchema = BaseUserSchema.extend({
  userId: z.string(),
  created: z.date(),
  updated: z.date()
});

const UserManagementUsersCreateUserSchema = BaseUserSchema;

const UserManagementUsersUserResponseSchema = z.object({
  data: z.array(UserManagementUsersUserSchema),
  nextCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string()
  }),
  prevCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string()
  })
});

const c = initContract();

export const users = c.router({
  getAllUsers: {
    method: 'GET',
    path: '/api/users',
    responses: {
      200: UserManagementUsersUserResponseSchema,
      400: ErrorResponseSchema
    },
    query: PaginateQuerySchema,
    summary: 'Get users with optional limit and reverse flag',
    description: 'Get users with optional limit and reverse flag',
    metadata: { roles: ['admin'] } as const,
    strictStatusCodes: true
  },

  createUser: {
    method: 'POST',
    path: '/api/users',
    responses: {
      201: UserManagementUsersUserSchema,
    },
    body: UserManagementUsersCreateUserSchema,
    summary: 'Create a new user',
    description: 'Create a new user',
    metadata: { roles: ['admin'] } as const,
    strictStatusCodes: true
  },

  getUserById: {
    method: 'GET',
    path: '/api/users/:id',
    responses: {
      200: UserManagementUsersUserSchema,
      404: ErrorResponseSchema,
    },
    summary: 'Find user by id',
    description: 'Find user by id',
    metadata: { 
      roles: ['admin'],
      identifierPath: 'params.id',
    } as const,
    strictStatusCodes: true
  },
});