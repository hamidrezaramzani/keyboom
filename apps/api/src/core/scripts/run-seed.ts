import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

import { seedCategories } from './categories.seed';

async function run() {
  console.log('🌱 Starting database seeding...\n');

  await seedCategories();

  console.log('\n🎉 All seeds completed successfully!');
  process.exit(0);
}

run().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
