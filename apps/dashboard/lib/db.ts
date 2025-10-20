import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
})


