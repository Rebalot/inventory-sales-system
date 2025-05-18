import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mockProducts = Array.from({ length: 200 }, (_, i) => {
  const stock = Math.floor(Math.random() * 100);
  const categories = ['Electronics', 'Clothing', 'Home', 'Office', 'Food'] as const;
  return {
    id: `PRD-${1000 + i}`,
    numericId: 1000 + i,
    name: `Product ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    stock,
    sku: `SKU-${10000 + i}`,
  };
});

async function main() {
    await prisma.product.createMany({
        data: mockProducts,
    });
    console.log('Mock de productos insertado correctamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });