import categories from './categories.json';
import { PrismaClient } from './generated';

const prisma = new PrismaClient();

async function insertCategory(category) {
  await prisma.category.create({
    data: {
      id: category.id,
      title: category.title,
      description: category.description || null,
      parentId: category.parentId,
    },
  });

  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      await insertCategory(child);
    }
  }
}

async function main() {
  const categoryArray = Object.values(categories); // 👈 convert object to array

  for (const category of categoryArray) {
    await insertCategory(category);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
