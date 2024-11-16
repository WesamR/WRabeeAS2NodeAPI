console.log("WesWork");
const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Open the SQLite database
let db;
(async () => {
  db = await sqlite.open({
    filename: './data/database.db',
    driver: sqlite3.Database
  });

  // Create a 'users' table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);
})();

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json({ message: 'success', data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.json({ message: 'success', data: { id: result.lastID, name, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});