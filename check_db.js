const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() { 
  const div = await prisma.divisi.findMany(); 
  console.log(div); 
}
main().finally(() => prisma.$disconnect());
