require('dotenv').config();
const database = require('./src/database/database');

async function setup() {
  console.log('Setting up MeetStranger Backend with PostgreSQL...\n');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required.');
    process.exit(1);
  }

  try {
    await database.connect();
    console.log('Database initialized successfully.');
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }
}

setup();
