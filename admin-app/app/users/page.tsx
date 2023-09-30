import styles from './page.module.css';
import { initClient,  } from "@ts-rest/core";
import { contract } from '@apple/shared/contracts';

const usersClient = initClient(contract.userManagement.users, {
  baseUrl: 'http://localhost:3001',
  baseHeaders: {}
});

async function getAllUsers() {
    const { body, status } = await usersClient.findAllUsers({
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

/* eslint-disable-next-line */
export interface UsersProps {}

export function Users(props: UsersProps) {
  getAllUsers();
  return (
    <div className={styles['container']}>
      <h1>Welcome to Users!</h1>
    </div>
  );
}

export default Users;
