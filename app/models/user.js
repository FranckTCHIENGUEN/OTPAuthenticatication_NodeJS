const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SALT_ROUND = 10;

const UserModel = prisma.user2;

module.exports = { prisma, SALT_ROUND, UserModel };