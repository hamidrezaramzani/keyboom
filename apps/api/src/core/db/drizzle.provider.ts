import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = 'DRIZZLE_CONNECTION';
export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'keyboom',
      ssl: process.env.NODE_ENV === 'production',
    });

    return drizzle(pool);
  },
};
