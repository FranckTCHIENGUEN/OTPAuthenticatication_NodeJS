const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TokenModel = prisma.token2;

module.exports = {
    TokenModel
};
