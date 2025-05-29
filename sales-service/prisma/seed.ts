import { NestFactory } from "@nestjs/core";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { AppModule } from "../src/app.module";
import { ProductServiceClient } from "../src/inventory-client/services/product.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { randomUUID } from "crypto";
import { generateAscendingDates } from "../src/common/utils/utils";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productService = app.get(ProductServiceClient);
  const prisma = app.get(PrismaService);

  const products = await productService.getProductsBulk(200);
  if (!products || products.length === 0) {
    console.error('No se pudieron obtener productos desde Inventory Service.');
    process.exit(1);
  }

  const createMockOrderItems = (count: number) => {
    const selected = products
      .sort(() => 0.5 - Math.random())
      .slice(0, count);

    return selected.map((product) => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        subtotal: product.price * quantity,
      };
    });
  };

  const startDate = new Date('2025-05-01T00:00:00Z');
  const ascendingDates = generateAscendingDates(startDate, 500);
  for (let i = 0; i < 500; i++) {
    const orderCounter = await prisma.counter.upsert({
    where: { name: 'order' },
    update: { value: { increment: 1 } },
    create: { name: 'order', value: 10000 },
    });

    const itemCount = Math.floor(Math.random() * 5) + 1;
    const orderItems = createMockOrderItems(itemCount);

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${orderCounter.value}`,
        customerId: randomUUID(),
        paymentMethod: ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'][
          Math.floor(Math.random() * 3)
        ] as PaymentMethod,
        total,
        status: ['COMPLETED', 'PROCESSING', 'SHIPPED', 'CANCELLED'][
          Math.floor(Math.random() * 4)
        ] as OrderStatus,
        date: ascendingDates[i],
        items: {
          create: orderItems,
        },
      },
    });
  }

  console.log('Seed orders created successfully');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});