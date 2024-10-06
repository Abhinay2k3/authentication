const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API!'); // You can customize this message
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
