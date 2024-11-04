import {db} from './index'; // Adjust the import according to your project structure
import * as schema from './schema'

async function seed() {
    await db.delete(schema.users)

    const users = [
        {name: 'Alice', email: 'alice@example.com'},
        {name: 'Bob', email: 'bob@example.com'},
        {name: 'Charlie', email: 'charlie@example.com'},
        {name: 'David', email: 'david@example.com'},
        {name: 'Eve', email: 'eve@example.com'},
        {name: 'Frank', email: 'frank@example.com'},
        {name: 'Grace', email: 'grace@example.com'},
        {name: 'Heidi', email: 'heidi@example.com'},
        {name: 'Ivan', email: 'ivan@example.com'},
        {name: 'Judy', email: 'judy@example.com'}
    ];

    await db.insert(schema.users).values(users);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
