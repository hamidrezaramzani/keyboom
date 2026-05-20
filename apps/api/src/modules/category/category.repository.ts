import { Inject, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { categories, Category } from './category.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}
  findAll() {
    return this.db.select().from(categories).orderBy(asc(categories.order));
  }

  async findById(id: string): Promise<Category | undefined> {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result[0];
  }
}
