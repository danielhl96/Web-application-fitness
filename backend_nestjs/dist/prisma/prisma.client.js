"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "prismaUser", {
    enumerable: true,
    get: function() {
        return prismaUser;
    }
});
require("dotenv/config");
const _client = require("@prisma/client");
const _adapterpg = require("@prisma/adapter-pg");
const _pg = require("pg");
const databaseUrl = process.env.USER_DATABASE_URL || process.env.DATABASE_URL || '';
const isLocalDatabase = /@(localhost|127\.0\.0\.1|testdb):/i.test(databaseUrl);
const userPool = new _pg.Pool({
    connectionString: databaseUrl,
    ssl: isLocalDatabase ? false : {
        rejectUnauthorized: false
    }
});
const userAdapter = new _adapterpg.PrismaPg(userPool);
const prismaUser = new _client.PrismaClient({
    adapter: userAdapter,
    log: [
        'query'
    ]
});
