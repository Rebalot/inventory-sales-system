import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "CLOTHES",
  "ELECTRONICS",
  "FURNITURE",
  "SHOES",
  "MISCELLANEOUS",
] as const;

type Category = (typeof categories)[number];

function getDescription(
  category: Category,
  name: string,
  sku: string
): string {
  switch (category) {
    case "ELECTRONICS":
      return `High-performance electronic device. Model ${name}. Ideal for everyday use with energy-efficient design and modern features. ${sku}.`;

    case "CLOTHES":
      return `Premium quality garment. ${name}. Crafted with durable fabric for all-day comfort. Available in multiple sizes. ${sku}.`;

    case "FURNITURE":
      return `Contemporary furniture piece. ${name}. Built with solid materials for long-lasting use. Fits modern and classic interiors. ${sku}.`;

    case "SHOES":
      return `Comfortable and stylish footwear. ${name}. Designed for daily wear with cushioned sole and breathable materials. ${sku}.`;

    case "MISCELLANEOUS":
      return `Versatile everyday item. ${name}. Practical design suitable for home or office use. ${sku}.`;

    default:
      return `Quality product. ${name}. ${sku}.`;
  }
}

const mockProducts = Array.from({ length: 200 }, (_, i) => {
  const stock = Math.floor(Math.random() * 100);
  const category =
    categories[Math.floor(Math.random() * categories.length)];

  const name = `Product ${i + 1}`;
  const sku = `SKU-${10000 + i}`;

  return {
    name,
    category,
    price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    stock,
    sku,
    image: `https://picsum.photos/seed/${sku}/400/400`,
    description: getDescription(category, name, sku),
  };
});

async function main() {
  await prisma.product.createMany({
    data: mockProducts,
  });

  console.log("Mock de productos insertado correctamente.");
}

main()
  .catch((e) => {
    console.error("Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });