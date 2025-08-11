import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'lodhaadmin',
    password: 'Admin123',
    port: 5432,
});

async function createAdminUser() {
    try {
        await client.connect();

        const username = 'lodha_admin';
        const plainTextPassword = 'admin@123';
        const hashedPassword = await bcrypt.hash(plainTextPassword, 10); // 10 is the salt rounds

        const queryText = `
            INSERT INTO "ad".login (username, password, name, designation, email)
            VALUES ($1, $2, 'Lodha Admin', 'Manager', 'admin@lodha.com')
            ON CONFLICT (username) DO UPDATE SET password = $2 WHERE "ad".login.username = $1;
        `;
        const values = [username, hashedPassword];

        await client.query(queryText, values);
        console.log(`User '${username}' created or updated successfully in "ad".login.`);
    } catch (err) {
        console.error('Error creating user', err);
    } finally {
        await client.end();
    }
}

createAdminUser();