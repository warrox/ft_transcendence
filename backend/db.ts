import * as sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('database.db', (err: Error | null) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  } else {
    console.log('Base de données SQLite connectée');
  }
});

db.run(`DROP TABLE "users";`);

db.serialize(() => {
  db.run(`
    CREATE TABLE "users" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_2FA INTEGER DEFAULT 0, 
      admin INTEGER DEFAULT 0,
      name VARCHAR(16) UNIQUE NOT NULL,
      surname TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
    INSERT INTO "users" (name, surname, email, password, admin)
    VALUES ("admin", "admin", "admin@mail.com", "1234", 1);
  `);
});

export default db;
