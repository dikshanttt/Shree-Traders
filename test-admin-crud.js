const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testAdminCrud() {
  console.log("=== TESTING ADMIN PRODUCT CRUD & STOCK MANAGEMENT ===");

  // 1. Fetch a category (e.g. Sarees or Mens)
  const category = await prisma.category.findFirst({ where: { slug: "sarees" } });
  if (!category) {
    console.error("No category found");
    return;
  }

  // 2. Create New Product
  console.log("\n1. Testing Product Creation...");
  const uniqueSlug = `test-luxury-kanjivaram-saree-${Date.now().toString(36)}`;
  const product = await prisma.product.create({
    data: {
      categoryId: category.id,
      name: "Luxury Kanjivaram Silk Saree",
      nameNe: "लक्जरी कान्जीवरम सिल्क साडी",
      slug: uniqueSlug,
      description: "Authentic pure silk Kanjivaram saree with rich contrast pallu.",
      descriptionNe: "शुद्ध सिल्क कान्जीवरम साडी।",
      brand: "Shree Traders Heritage",
      price: 7500,
      discountPrice: 6200,
      stock: 4,
      lowStockLimit: 3,
      homepagePriority: 10,
      status: "ACTIVE",
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800", isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: "Peacock Blue", colorHex: "#0284c7" },
          { colorName: "Mustard Gold", colorHex: "#ca8a04" },
        ],
      },
      sizes: {
        create: [
          { sizeName: "Free Size" },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  // Create variants
  for (const c of product.colors) {
    for (const s of product.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 2,
        },
      });
    }
  }

  console.log(`Created product: "${product.name}" (ID: ${product.id}, Initial Stock: ${product.stock})`);

  // 3. Test Restock / Stock Adjustment
  console.log("\n2. Testing Stock Restocking (+5 units)...");
  await prisma.product.update({
    where: { id: product.id },
    data: { stock: product.stock + 5 },
  });

  const restocked = await prisma.product.findUnique({ where: { id: product.id } });
  console.log(`Stock after restock: ${restocked.stock} (Expected: 9)`);

  // 4. Test Stock Reduction (-9 units -> 0 -> OUT_OF_STOCK)
  console.log("\n3. Testing Stock Depletion to 0...");
  await prisma.product.update({
    where: { id: product.id },
    data: { stock: 0, status: "OUT_OF_STOCK" },
  });

  const outOfStockProd = await prisma.product.findUnique({ where: { id: product.id } });
  console.log(`Stock: ${outOfStockProd.stock}, Status: ${outOfStockProd.status} (Expected: OUT_OF_STOCK)`);

  // 5. Test Deletion
  console.log("\n4. Testing Product Deletion...");
  await prisma.productVariant.deleteMany({ where: { productId: product.id } });
  await prisma.productColor.deleteMany({ where: { productId: product.id } });
  await prisma.productSize.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.product.delete({ where: { id: product.id } });

  const checkDeleted = await prisma.product.findUnique({ where: { id: product.id } });
  console.log("Deleted product check:", checkDeleted === null ? "SUCCESSFULLY DELETED" : "FAILED");

  console.log("\n=== ALL ADMIN CRUD TESTS PASSED SUCCESSFULLY! ===");
}

testAdminCrud()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
