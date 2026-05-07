import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { categories } from './category.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}
  findAll() {
    return this.db.select().from(categories).orderBy(asc(categories.order));
  }
}
