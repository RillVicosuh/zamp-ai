//Run with node scripts/seed.ts

const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

//inserting categories into the database
async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: 'Athletes' }
            ],
        });
    } catch (error) {
        console.error('Error seeding default categories:', error);
    } finally {
        await db.$disconnect();
    }
}

main();