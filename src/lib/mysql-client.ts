
import mysql from 'serverless-mysql';

// MySQL client configuration
const db = mysql({
  config: {
    host: import.meta.env.VITE_MYSQL_HOST || 'localhost',
    port: Number(import.meta.env.VITE_MYSQL_PORT) || 3306,
    database: import.meta.env.VITE_MYSQL_DATABASE || 'relief_connect',
    user: import.meta.env.VITE_MYSQL_USER || 'root',
    password: import.meta.env.VITE_MYSQL_PASSWORD || '',
  },
});

// Helper function to execute SQL queries
export async function executeQuery<T>({ query, values }: { query: string; values?: any[] }): Promise<T> {
  try {
    const results = await db.query<T>(query, values);
    await db.end();
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// User table SQL for setup (can be used to create the table if needed)
export const userTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('victim', 'volunteer', 'ngo', 'government', 'admin') NOT NULL DEFAULT 'victim',
  profile_img VARCHAR(255),
  can_volunteer BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export default db;
