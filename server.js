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

  // Create a 'Greetings' table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Greetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeOfDay TEXT NOT NULL,
      language TEXT NOT NULL,
      greetingMessage TEXT NOT NULL,
      tone TEXT NOT NULL
    )
  `);

  // Seed
  const greetings = [
    ['Morning', 'English', 'Good Morning', 'Formal'],
    ['Morning', 'English', 'Hi! Good Morning!', 'Casual'],
    ['Afternoon', 'English', 'Good Afternoon', 'Formal'],
    ['Afternoon', 'English', 'Hey! Good Afternoon!', 'Casual'],
    ['Evening', 'English', 'Good Evening', 'Formal'],
    ['Evening', 'English', 'Hey! Good Evening!', 'Casual'],

    ['Morning', 'French', 'Bonjour', 'Formal'],
    ['Morning', 'French', 'Salut, Bonjour', 'Casual'],
    ['Afternoon', 'French', 'Bon Après-midi', 'Formal'],
    ['Afternoon', 'French', 'Salut! Bon Après-midi!', 'Casual'],
    ['Evening', 'French', 'Bonsoir', 'Formal'],
    ['Evening', 'French', 'Salut! Bonsoir!', 'Casual'],

    ['Morning', 'Spanish', 'Buenos Días', 'Formal'],
    ['Morning', 'Spanish', 'Hola! Buenos Días!', 'Casual'],
    ['Afternoon', 'Spanish', 'Buenas Tardes', 'Formal'],
    ['Afternoon', 'Spanish', 'Hola, Buenas!', 'Casual'],
    ['Evening', 'Spanish', 'Buenas Noches', 'Formal'],
    ['Evening', 'Spanish', 'Hola! Buenas Noches!', 'Casual'],

    ['Morning', 'Arabic', 'Marhaba, Sabah', 'Casual'],
    ['Afternoon', 'Arabic', 'Marhaba, Masa', 'Casual'],
    ['Evening', 'Arabic', 'Marhaba, Masa', 'Casual'],
    ['Morning', 'Arabic', 'Sabah Al-Khair', 'Formal'],
    ['Afternoon', 'Arabic', 'Masa\' Alkhayr', 'Formal'],
    ['Evening', 'Arabic', 'Masa\' Alkhayr', 'Formal']
    
  ];

  const stmt = await db.prepare('INSERT INTO Greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)');
  for (const greeting of greetings) {
    await stmt.run(greeting);
  }
  await stmt.finalize();
})();

app.post('/api/WRgreet', async (req, res) => {
  const { timeOfDay, language, tone } = req.body;
  
  try {
    const row = await db.get(
      "SELECT greetingMessage FROM Greetings WHERE timeOfDay = ? AND language = ? AND tone = ?",
      [timeOfDay, language, tone]
    );
    
    if (row) {
      res.json({ greetingMessage: row.greetingMessage });
    } else {
      res.status(404).send('Your Greeting could not be found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/WRtimesOfDay', async (req, res) => {
  try {
    const rows = await db.all("SELECT DISTINCT timeOfDay FROM Greetings");
    res.json(rows.map(row => row.timeOfDay));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/WRlanguages', async (req, res) => {
  try {
    const rows = await db.all("SELECT DISTINCT language FROM Greetings");
    res.json(rows.map(row => row.language));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
