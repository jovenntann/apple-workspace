import { initClient,  } from "@ts-rest/core";
import { contract } from '@apple/shared/contracts';

const client = initClient(contract.productManagementContract.productContract, {
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

run()