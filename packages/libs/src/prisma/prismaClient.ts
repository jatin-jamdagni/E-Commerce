 import { PrismaClient } from '@prisma/client';
 interface CustomGlobal extends Global {
  prismadb?: PrismaClient;
}

declare const global: CustomGlobal;

const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {

  global.prismadb = prisma;

}


export { prisma };
