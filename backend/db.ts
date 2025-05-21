import * as sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('database.db', (err: Error | null) => {
	if (err) {
		console.error("Erreur lors de l'ouverture de la base de données", err);
	} else {
		console.log('Base de données SQLite connectée');
	}
});

db.serialize(() => {
	// Active les contraintes de clé étrangère
	db.run(`PRAGMA foreign_keys = ON`);

	db.run(`
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	is_2FA INTEGER DEFAULT 0, 
	is_googleUser INTEGER DEFAULT 0,
	name VARCHAR(16) UNIQUE NOT NULL,
	surname TEXT UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	avatar_path TEXT,  
	win INTEGER DEFAULT 0,
	loose INTEGER DEFAULT 0,
	lang TEXT DEFAULT 'fr'
)`);

	db.run(`
CREATE TABLE IF NOT EXISTS games (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	result TEXT CHECK(result IN ('win', 'lose')) NOT NULL,	
	guest_name TEXT,
	game_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	score TEXT NOT NULL ,
	bounce INTEGER,
	input_per_second INTEGER,
	FOREIGN KEY (user_id) REFERENCES users(id)
)`);

	db.run(`
CREATE TABLE IF NOT EXISTS friends (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	friend_id INTEGER NOT NULL,
	is_online INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (friend_id) REFERENCES users(id),
	UNIQUE(user_id, friend_id)
)`);
});

export default db;
