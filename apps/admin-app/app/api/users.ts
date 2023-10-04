import { initClient,  } from "@ts-rest/core";
import { contract } from '@apple/shared/contracts';
import { UserManagementUsersCreateUser } from '@apple/shared/contracts';


const usersClient = initClient(contract.userManagement.users, {
  baseUrl: 'http://localhost:3001',
  baseHeaders: {}
});

export async function getAllUsers() {
    const { body, status } = await usersClient.getAllUsers({
      query: {
        limit: '10',
      }
    });

    if (status === 200) {
        console.log(body)
        return body;
    }

    if (status === 400) {
        return body;
    }
}

export async function createUser(userData: UserManagementUsersCreateUser) {
  const { body, status } = await usersClient.createUser({
    body: userData
  });

  if (status === 201) {
    console.log(body);
    return body;
  }
}

export async function testCreateUser() {
  const userData: UserManagementUsersCreateUser = {
    username: 'testUser',
    email: 'testUser@example.com',
    firstName: 'Test',
    lastName: 'User'
  };

  const user = await createUser(userData);
  console.log(user);
}