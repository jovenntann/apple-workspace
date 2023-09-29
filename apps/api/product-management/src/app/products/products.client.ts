import { initClient,  } from "@ts-rest/core";
import { contract } from '@apple/shared/contracts';

const client = initClient(contract.productManagement.products, {
    baseUrl: 'http://localhost:3000/api',
    baseHeaders: {}
});

const categoriesClient = initClient(contract.productManagement.categories, {
    baseUrl: 'http://localhost:3000/api',
    baseHeaders: {}
});

const usersClient = initClient(contract.userManagement.users, {
    baseUrl: 'http://localhost:3001/api',
    baseHeaders: {}
});



async function run() {
    const { body, status } = await client.findAllProducts({
        query: {
            limit: '10',
            reverse: 'true',
            cursorPointer: `{
                "SK": "01HANX58Z8PQ0PS19XM66Z2SDP",
                "PK": "PRODUCT",
                "GSI2PK": "PRODUCT",
                "GSI2SK": "2023-09-19T05:03:43.080Z"
            `,
            direction: 'next'
        }
    });

    if (status === 200) {
        return body;
    }

    if (status === 400) {
        return body
    }
}

async function getAllCategories() {
    const { body, status } = await categoriesClient.findAllCategories();

    if (status === 200) {
        return body;
    }

    if (status === 400) {
        return body;
    }
}

async function getProductById(id: string) {
    const { body, status } = await client.getProductById({ params: { id } });

    if (status === 200) {
        return body;
    }

    if (status === 400) {
        return body;
    }
}

async function getAllUsers() {
    const { body, status } = await usersClient.findAllUsers();

    if (status === 200) {
        return body;
    }

    if (status === 400) {
        return body;
    }
}

async function createUser(user: { username: string, email: string }) {
    const { body, status } = await usersClient.createUser({ body: user });

    if (status === 201) {
        return body;
    }
}




run()
getAllCategories()
getProductById('12345')
getAllUsers()
createUser({ username: 'test', email: 'test@example.com' })

