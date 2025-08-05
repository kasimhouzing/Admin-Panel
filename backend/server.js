import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Client } = pkg;
const app = express();
const port = process.env.PORT || 3000; // Server is running on port 3000

// Middleware
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:8080', // Allow requests from your React frontend's actual port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// PostgreSQL client configuration
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'houzingpartners',
    password: 'Admin123',
    port: 5432,
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database!');
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });

// Define your API routes
app.get('/', (req, res) => {
    res.send('Welcome to the Lodha Stella Camp Management API!');
});

app.get('/api/widgets-data', async (req, res) => {
    try {
        const queryText = `
      SELECT name, 
        designation, 
        phone, 
        last_login, 
         email,
         status
      from HP.users
    `;
        const result = await client.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching widgets data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Add a new route for creating a user
app.post('/api/addusers', async (req, res) => {
    try {
        const { name, designation, phone, email } = req.body;

        const queryText = `
            INSERT INTO HP.users (name, designation, phone, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *; 
        `;
        const values = [name, designation, phone, email];
        
        const result = await client.query(queryText, values);

        // Send back the newly created user record
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting new user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// 3. PUT update an existing user
app.put('/api/updatedusers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, designation, phone, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE "HP".users SET name = $1, designation = $2, phone = $3, email = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, designation, phone, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});