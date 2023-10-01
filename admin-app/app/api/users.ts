import { initClient,  } from "@ts-rest/core";
import { contract } from '@apple/shared/contracts';

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