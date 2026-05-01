import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NewUser, User, users } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<User>) {}

  async create(user: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();

    return result[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  }
}
