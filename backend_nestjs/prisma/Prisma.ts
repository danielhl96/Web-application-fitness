import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Define a type for the user pool to avoid type conflicts
type UserPool = InstanceType<typeof Pool>;

const userPool: UserPool = new Pool({
  connectionString: process.env.USER_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const userAdapter = new PrismaPg(userPool);

export const prismaUser = new PrismaClient({
  adapter: userAdapter,
  log: ['query'],
});
