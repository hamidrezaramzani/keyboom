import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { categories } from 'src/modules/category/category.schema';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'keyboom',
  ssl: process.env.NODE_ENV === 'production',
});

const db = drizzle(pool);
export const defaultCategories = [
  {
    id: crypto.randomUUID(),
    name: 'سرگرمی',
    nameEn: 'entertainment',
    key: 'entertainment',
    order: 1,
  },
  {
    id: crypto.randomUUID(),
    name: 'کاری',
    nameEn: 'work',
    key: 'work',
    order: 2,
  },
  {
    id: crypto.randomUUID(),
    name: 'ذخیره‌سازی ابری',
    nameEn: 'cloud',
    key: 'cloud',
    order: 3,
  },
  {
    id: crypto.randomUUID(),
    name: 'ابزار توسعه',
    nameEn: 'development',
    key: 'development',
    order: 4,
  },
  {
    id: crypto.randomUUID(),
    name: 'آموزشی',
    nameEn: 'education',
    key: 'education',
    order: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'امنیت',
    nameEn: 'security',
    key: 'security',
    order: 6,
  },
  {
    id: crypto.randomUUID(),
    name: 'سلامت',
    nameEn: 'health',
    key: 'health',
    order: 7,
  },
  {
    id: crypto.randomUUID(),
    name: 'بهره‌وری',
    nameEn: 'productivity',
    key: 'productivity',
    order: 8,
  },
  {
    id: crypto.randomUUID(),
    name: 'ارتباطات',
    nameEn: 'communication',
    key: 'communication',
    order: 9,
  },
  {
    id: crypto.randomUUID(),
    name: 'خرید',
    nameEn: 'shopping',
    key: 'shopping',
    order: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'سایر',
    nameEn: 'other',
    key: 'other',
    order: 11,
  },
];

export async function seedCategories() {
  console.log('📂 Seeding categories...');
  for (const category of defaultCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
  console.log('✅ Categories seeded');
}
