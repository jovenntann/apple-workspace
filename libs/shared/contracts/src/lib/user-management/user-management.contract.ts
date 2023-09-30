import { initContract } from '@ts-rest/core';
import { users } from './users/users.contract';

const c = initContract();

export const userManagement = c.router({
  users: users
});