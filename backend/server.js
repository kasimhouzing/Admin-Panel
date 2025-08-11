import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Client } = pkg;
const app = express();
const port = process.env.PORT || 3000; // Server is running on port 3000
const JWT_SECRET = 'your-super-secret-jwt-key';
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
    database: 'lodhaadmin',
    password: 'Admin123',
    port: 5432,
});

//add by sagar
// Function to initialize the database schema and table
const initializeDatabase = async () => {
    try {
        await client.query('CREATE SCHEMA IF NOT EXISTS "ad";');
        console.log('Schema "ad" checked/created successfully.');

        // Table for Login Credentials (authentication)
        const createLoginTableQuery = `
            CREATE TABLE IF NOT EXISTS ad.login (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `;
        await client.query(createLoginTableQuery);
        console.log('Table "ad.login" checked/created successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};




//add by sagar
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

//add by sagar

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// **The main change for real login with bcrypt.**
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const queryText = 'SELECT * FROM ad.login WHERE username = $1';
        const result = await client.query(queryText, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Use bcrypt to compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { username: user.username } });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//add by sagar


app.get('/api/widgets-data', async (req, res) => {
    try {
        const queryText = `
      SELECT id,
      name, 
        designation, 
        phone, 
        last_login, 
         email,
         status
      from ad.users where active = 'true' ORDER BY id desc;
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
            INSERT INTO ad.users (name, designation, phone, email)
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
        const result = await client.query(
            'UPDATE ad.users SET name = $1, designation = $2, phone = $3, email = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
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

// 4. PUT update user status (active/suspended)
app.put('/api/users/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Add this console.log to see the incoming data
    console.log('Received status update request for ID:', id, 'with status:', status);

    // Validate status value to prevent SQL injection
    if (status !== 'active' && status !== 'suspended') {
        return res.status(400).json({ error: 'Invalid status value. Must be "active" or "suspended".' });
    }
    try {
        const result = await client.query(
            'UPDATE ad.users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user status:', err); // <-- Check this error in your terminal!
        res.status(500).json({ error: 'Internal server error' });
    }
});


// DELETE /api/users/:id: Delete a user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Corrected SQL query: 'false' is a boolean, not a string
        const result = await client.query('UPDATE ad.users SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;', [id]);

        // Check if any rows were actually updated
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 204 No Content is standard for a successful DELETE with no response body
        res.status(204).send();
    } catch (err) {
        // Log the full error for debugging
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// GET all contractors
app.get('/api/contractorsdata', async (req, res) => {
    try {
        const queryText = `
       SELECT id,
          name,
		  company_name,
		  phone, 
		  email, 
		  reference_from, 
		  total_totalLaborers, 
		  documents,
          address,
          status 		  
   from ad.hp_contractors  where active = 'true' ORDER BY id ASC
    `;
        const result = await client.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching contractors data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// POST a new contractor
app.post('/api/contractorsdata', async (req, res) => {
    try {
        const { name, companyName, phone, email, address, referenceFrom, totalLaborers, documents } = req.body;

        const queryText = `
            INSERT INTO ad.hp_contractors (name, company_name, phone, email, address, reference_from, total_laborers, documents)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [name, companyName, phone, email, address, referenceFrom, totalLaborers, documents];
        const result = await client.query(queryText, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding new contractor:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


// PUT to update a contractor
app.put('/api/contractorsdata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, companyName, phone, email, address, referenceFrom, totalLaborers, status, documents } = req.body;

        const queryText = `
            UPDATE ad.hp_contractors
            SET 
                name = $1,
                company_name = $2,
                phone = $3,
                email = $4,
                address = $5,
                reference_from = $6,
                total_laborers = $7,
                status = $8,
                documents = $9,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *;
        `;
        const values = [name, companyName, phone, email, address, referenceFrom, totalLaborers, status, documents, id];
        const result = await client.query(queryText, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Contractor not found' });
        }
    } catch (error) {
        console.error('Error updating contractor data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// DELETE a contractor (soft delete)
app.delete('/api/contractorsdata/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const queryText = `
            UPDATE ad.hp_contractors
            SET active = FALSE, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;
        const result = await client.query(queryText, [id]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Contractor deleted successfully (soft delete)' });
        } else {
            res.status(404).json({ error: 'Contractor not found' });
        }
    } catch (error) {
        console.error('Error deleting contractor data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


//  PUT update user status (active/suspended)
app.put('/api/contractors/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'suspended') {
        return res.status(400).json({ error: 'Invalid status value. Must be "active" or "suspended".' });
    }
    try {
        const result = await client.query(
            'UPDATE ad.hp_contractors SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contractor not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating contractor status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//LABOR MANEMENT FACH TABLE 

app.get('/api/labormanagement', async (req, res) => {
    try {
        const queryText = `
      SELECT lab_id, 
      lab_name, 
	  date_of_birth, 
	  age, 
	  gender, 
	  blood_group, 
	  mobile_number, 
	  email_id, 
	  aadhar_number, 
	  designation_trade, 
	  select_vendor,
	  reported_to_incharge, 
	  photo_upload, 
	  self_declaration_upload,
	  medical_certificate, 
	  appointment_letter_upload, 
	  aadhar_front_upload, 
	  additional_document_1, 
	  additional_document_2, 
	  created_date, 
	  updated_date, 
	  active, 
	  status
	FROM ad.labourer_details
    WHERE active = true
ORDER BY lab_id ASC;
    `;
        const result = await client.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching widgets data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// add POST route to handle data insertion
app.post('/insert-labourer', async (req, res) => {
    const {
        lab_Name, // <-- ADD THIS
        Date_Of_Birth,
        Age,
        Gender,
        Blood_Group,
        Mobile_Number,
        Email_ID,
        Aadhar_Number,
        Designation_Trade,
        Select_Vendor,
        Reported_to_Incharge,
        Photo_Upload,
        Self_Declaration_Upload,
        Medical_Certificate,
        Appointment_Letter_Upload,
        Aadhar_Front_Upload,
        Additional_Document_1,
        Additional_Document_2
    } = req.body;

    const queryText = `
    INSERT INTO ad.Labourer_Details (
    lab_Name,
    Date_Of_Birth,
    Age,
    Gender,
    Blood_Group,
    Mobile_Number,
    Email_ID,
    Aadhar_Number,
    Designation_Trade,
    Select_Vendor,
    Reported_to_Incharge,
    Photo_Upload,
    Self_Declaration_Upload,
    Medical_Certificate,
    Appointment_Letter_Upload,
    Aadhar_Front_Upload,
    Additional_Document_1,
    Additional_Document_2
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING *;`;

    const values = [
        lab_Name, // <-- ADD THIS
        Date_Of_Birth,
        Age,
        Gender,
        Blood_Group,
        Mobile_Number,
        Email_ID,
        Aadhar_Number,
        Designation_Trade,
        Select_Vendor,
        Reported_to_Incharge,
        Photo_Upload,
        Self_Declaration_Upload,
        Medical_Certificate,
        Appointment_Letter_Upload,
        Aadhar_Front_Upload,
        Additional_Document_1,
        Additional_Document_2
    ];

    try {
        const result = await client.query(queryText, values);
        res.status(201).json({
            message: 'Labourer details inserted successfully!',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({
            error: 'An error occurred while inserting data.',
            details: err.message
        });
    }
});


//updated labor management 
// A PUT endpoint to update labourer details using lab_id
app.put('/labourer/:labId', async (req, res) => {
    const labId = req.params.labId; // Capture the lab_id from the URL
    const {
        lab_Name,
        Date_Of_Birth,
        Age,
        Gender,
        Blood_Group,
        Mobile_Number,
        Email_ID,
        Designation_Trade,
        Select_Vendor,
        Reported_to_Incharge,
        Photo_Upload,
        Self_Declaration_Upload,
        Medical_Certificate,
        Appointment_Letter_Upload,
        Aadhar_Front_Upload,
        Additional_Document_1,
        Additional_Document_2
    } = req.body;

    const queryText = `
        UPDATE ad.Labourer_Details
        SET
            lab_Name = $1,
            Date_Of_Birth = $2,
            Age = $3,
            Gender = $4,
            Blood_Group = $5,
            Mobile_Number = $6,
            Email_ID = $7,
            Designation_Trade = $8,
            Select_Vendor = $9,
            Reported_to_Incharge = $10,
            Photo_Upload = $11,
            Self_Declaration_Upload = $12,
            Medical_Certificate = $13,
            Appointment_Letter_Upload = $14,
            Aadhar_Front_Upload = $15,
            Additional_Document_1 = $16,
            Additional_Document_2 = $17
        WHERE lab_id = $18;
    `;
    const values = [
        lab_Name,
        Date_Of_Birth,
        Age,
        Gender,
        Blood_Group,
        Mobile_Number,
        Email_ID,
        Designation_Trade,
        Select_Vendor,
        Reported_to_Incharge,
        Photo_Upload,
        Self_Declaration_Upload,
        Medical_Certificate,
        Appointment_Letter_Upload,
        Aadhar_Front_Upload,
        Additional_Document_1,
        Additional_Document_2,
        labId // Use the labId from the URL as the last parameter
    ];

    try {
        const result = await client.query(queryText, values);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Labourer details updated successfully.' });
        } else {
            res.status(404).json({ message: 'Labourer not found.' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// lABOR MANAGEMENT PUT update user status (active/suspended)
app.put('/api/contractors/status/:labId', async (req, res) => {
    const { labId } = req.params; // Correct variable name from the URL
    const { status } = req.body;

    if (status !== 'active' && status !== 'suspended') {
        return res.status(400).json({ error: 'Invalid status value. Must be "active" or "suspended".' });
    }
    try {
        const result = await client.query(
            'UPDATE ad.Labourer_Details SET status = $1, updated_date = CURRENT_TIMESTAMP WHERE lab_id = $2 RETURNING *',
            [status, labId] // Use 'labId' here instead of 'id'
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contractor not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating contractor status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get a single labourer's details and documents
app.get('/api/contractors/:labId', async (req, res) => {
    const { labId } = req.params;

    try {
        const result = await client.query(
            'SELECT * FROM ad.Labourer_Details WHERE lab_id = $1',
            [labId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Labor not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching labor details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// DELETE endpoint to remove a labourer record
app.delete('/api/labourer/:id', async (req, res) => {    
    
    const { id } = req.params;
    console.log('Attempting to delete labourer with ID:', id);
    try {
        const query = 'UPDATE ad.Labourer_Details SET active = false, updated_date = CURRENT_TIMESTAMP WHERE lab_id = $1 RETURNING *';
        const result = await client.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Labourer not found.' });
        }

        res.status(200).json({ message: 'Labourer record deleted successfully.', deletedRecord: result.rows[0] });
    } catch (error) {
        console.error('Error deleting labourer:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});