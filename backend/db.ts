import * as sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('database.db', (err: Error | null) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  } else {
    console.log('Base de données SQLite connectée');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(16) UNIQUE NOT NULL,
      surname TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

export default db;
