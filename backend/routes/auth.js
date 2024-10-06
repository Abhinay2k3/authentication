const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../users.json');

// Helper function to read users file
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper function to write to users file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Registration route
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const users = readUsers();
    
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    users.push({ username, email, password });
    writeUsers(users);

    res.status(201).json({ message: 'Registration successful' });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;
