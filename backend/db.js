const sqlite3 = require('sqlite3').verbose();

// Ouvrir la base de données
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  } else {
    console.log('Base de données SQLite connectée');
  }
});

// Créer une table si elle n'existe pas encore
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
	  surname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
	  password TEXT NOT NULL
    )
  `);
});

module.exports = db;

