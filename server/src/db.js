const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/eloktantra'
});

const initializeDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS voters (
      id SERIAL PRIMARY KEY,
      voter_id_hash VARCHAR(255) UNIQUE NOT NULL,
      name_encrypted VARCHAR(255) NOT NULL,
      constituency VARCHAR(255) NOT NULL,
      voter_card_image_path TEXT NOT NULL,
      face_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      voter_id_hash VARCHAR(255) NOT NULL,
      election_id VARCHAR(255) NOT NULL,
      candidate_id VARCHAR(255) NOT NULL,
      constituency_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(voter_id_hash, election_id)
    );
  `;
  try {
    await pool.query(query);
    console.log('PostgreSQL: voters table initialized');
  } catch (err) {
    console.warn('PostgreSQL: error initializing voters table', err.message);
  }
};

initializeDB();

module.exports = {
  query: (text, params) => pool.query(text, params)
};
