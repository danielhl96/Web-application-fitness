import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Define a type for the user pool to avoid type conflicts
type UserPool = InstanceType<typeof Pool>;

const databaseUrl = process.env.USER_DATABASE_URL || process.env.DATABASE_URL || '';
const isLocalDatabase = /@(localhost|127\.0\.0\.1|testdb):/i.test(databaseUrl);

const userPool: UserPool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
});
const userAdapter = new PrismaPg(userPool);

export const prismaUser = new PrismaClient({
  adapter: userAdapter,
  log: ['query'],
});

export type PrismaUserClient = typeof prismaUser;
