import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
const db = await open({
  filename: process.env.DATABASE_FILE || './database.sqlite',
  driver: sqlite3.Database,
});

// Create the tweet table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS tweet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
// Create the user table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
// Insert a default user if the table is empty
const userCount = await db.get('SELECT COUNT(*) AS count FROM user');
const messageCount = await db.get('SELECT COUNT(*) AS count FROM tweet');
if (userCount.count === 0) {
  await db.run('INSERT INTO user (name , password) VALUES (? ,?)', 'man', "$2b$10$.sgHXzn4YNImwujwSJGaP.yom9zCLrfHn1P6soeonlya4umqCakcC");
  await db.run('INSERT INTO user (name , password) VALUES (? ,?)', 'robin', "$2b$10$SSd0NJcBeBE/H7C1T0IwJuSgnrHTHvDV.tZRw6aRsjsvCbDocGDsm");

}
if (messageCount === 0) {
  await db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', 'Babago', '1');
  await db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', 'Hejsan', '2');

}


console.log(messageCount, userCount);



// Export the database connection
export default db;