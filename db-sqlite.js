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
    name VARCHAR(32),
    password VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const tweets = await db.all(`
  SELECT 
    tweet.id,
    tweet.message,
    tweet.author_id,
    strftime('%Y-%m-%dT%H:%M:%SZ', tweet.created_at) AS created_at,
    user.name
  FROM tweet
  JOIN user ON tweet.author_id = user.id
`);

tweets.forEach(tweet => {
  console.log('Raw timestamp:', tweet.created_at);
  console.log('Parsed date:', new Date(tweet.created_at));
  const utcDate = new Date(tweet.created_at);  // Parses UTC timestamp
  const localDateString = utcDate.toLocaleString(); // Converts to local time string based on user's timezone

  console.log('Local time:', localDateString);
});
  
// Insert a default user if the table is empty
const userCount = await db.get('SELECT COUNT(*) AS count FROM user');
const messageCount = await db.get('SELECT COUNT(*) AS count FROM tweet');
if (userCount.count === 0) {
  await db.run('INSERT INTO user (name , password) VALUES (? ,?)', 'man', "$2b$10$.sgHXzn4YNImwujwSJGaP.yom9zCLrfHn1P6soeonlya4umqCakcC");
  await db.run('INSERT INTO user (name , password) VALUES (? ,?)', 'robin', "$2b$10$SSd0NJcBeBE/H7C1T0IwJuSgnrHTHvDV.tZRw6aRsjsvCbDocGDsm");

}
if (messageCount === 0) {
  await db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', 'Babago', '1', );
  await db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', 'Hejsan', '2', );

}


console.log(messageCount, userCount);



// Export the database connection
export default db;