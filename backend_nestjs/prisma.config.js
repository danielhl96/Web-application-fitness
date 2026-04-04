// @ts-check
const { defineConfig } = require('prisma/config');

/** @type {import('prisma/config').PrismaConfig} */
module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.USER_DATABASE_URL,
  },
});
