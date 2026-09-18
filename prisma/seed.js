const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning database ---');
  await prisma.reservation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Seeding Users ---');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  await prisma.user.create({
    data: {
      name: 'Shree Traders Admin',
      email: 'admin@shreetraders.com',
      phone: '+977-9800000000',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Pooja Sharma',
      email: 'customer@gmail.com',
      phone: '9812345678',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('--- Seeding Delivery Zones ---');
  await Promise.all([
    prisma.deliveryZone.create({
      data: {
        zoneName: 'Damak (Within Ring Road / मुख्य बजार)',
        deliveryFee: 50,
        active: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        zoneName: 'Damak Lekhnath Chowk & Outskirts (लेकनाथ चोक आसपास)',
        deliveryFee: 60,
        active: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        zoneName: 'Urlabari & Birtamode Highway Area (उर्लाबारी / बिर्तामोड)',
        deliveryFee: 100,
        active: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        zoneName: 'Jhapa District Rural / Suburbs (झापा जिल्ला)',
        deliveryFee: 140,
        active: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        zoneName: 'Biratnagar & Eastern Cities (विराटनगर / पूर्व)',
        deliveryFee: 190,
        active: true,
      },
    }),
  ]);

  console.log('--- Seeding Categories ---');
  const catSarees = await prisma.category.create({
    data: {
      name: 'Sarees',
      nameNe: 'साडी',
      slug: 'sarees',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catKurtas = await prisma.category.create({
    data: {
      name: 'Kurtas & Kurtis',
      nameNe: 'कुर्ता तथा कुर्ती',
      slug: 'kurtas',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catMens = await prisma.category.create({
    data: {
      name: "Men's Fashion",
      nameNe: 'पुरुष फेसन',
      slug: 'mens-wear',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catKids = await prisma.category.create({
    data: {
      name: "Kids' Wear",
      nameNe: 'बालबालिका फेसन',
      slug: 'kids-wear',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Fashion Accessories',
      nameNe: 'फेसन सामग्री',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catPurses = await prisma.category.create({
    data: {
      name: 'Purses & Handbags',
      nameNe: 'पर्स तथा ब्याग',
      slug: 'purses',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    },
  });

  const catCosmetics = await prisma.category.create({
    data: {
      name: 'Cosmetics & Beauty',
      nameNe: 'कस्मेटिक्स तथा सौन्दर्य',
      slug: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    },
  });

  console.log('--- Seeding Products & Variants ---');

  // Product 1: Red Banarasi Silk Saree
  const prod1 = await prisma.product.create({
    data: {
      categoryId: catSarees.id,
      name: "Women's Pure Banarasi Silk Bridal Saree",
      nameNe: 'शुद्ध बनारसी सिल्क दुलही साडी',
      slug: 'womens-pure-banarasi-silk-bridal-saree',
      description: 'Handcrafted luxury Banarasi silk saree with opulent golden zari embroidery. Perfect for weddings, festivals, and cultural occasions in Damak. Includes matching blouse piece.',
      descriptionNe: 'विवाह तथा चाडपर्वका लागि उपयुक्त उच्च गुणस्तरको बनारसी सिल्क साडी, आकर्षक सुनौलो जरी काम र म्याचिङ ब्लाउज पिससहित।',
      brand: 'Shree Traders Heritage',
      price: 6800,
      discountPrice: 5499,
      stock: 6,
      lowStockLimit: 3,
      featuredCategory: 'SAREES',
      homepagePriority: 10,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Bridal Crimson Red', colorHex: '#991b1b' },
          { colorName: 'Royal Maroon', colorHex: '#7f1d1d' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'Free Size (5.5m + Blouse)' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod1.colors) {
    for (const s of prod1.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod1.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 3,
        },
      });
    }
  }

  // Product 2: Designer Chiffon Party Saree
  const prod2 = await prisma.product.create({
    data: {
      categoryId: catSarees.id,
      name: 'Designer Chiffon Party Wear Saree',
      nameNe: 'डिजाइनर सिफन पार्टी वेयर साडी',
      slug: 'designer-chiffon-party-wear-saree',
      description: 'Lightweight flowing chiffon saree embellished with delicate sequin border work. Easy to drape and exceptionally graceful.',
      descriptionNe: 'हल्का र लगाउन अत्यन्तै सजिलो सिफन साडी, सुन्दर सिक्विन बोर्डर कामसहित।',
      brand: 'Shree Exclusive',
      price: 4200,
      discountPrice: 3499,
      stock: 8,
      lowStockLimit: 4,
      featuredCategory: 'SAREES',
      homepagePriority: 9,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Emerald Green', colorHex: '#047857' },
          { colorName: 'Midnight Navy', colorHex: '#1e3a8a' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'Free Size' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod2.colors) {
    for (const s of prod2.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod2.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 4,
        },
      });
    }
  }

  // Product 3: Anarkali Kurta Set
  const prod3 = await prisma.product.create({
    data: {
      categoryId: catKurtas.id,
      name: 'Embroidered Anarkali Kurta Set with Dupatta',
      nameNe: 'कढाई गरिएको अनारकली कुर्ता सेट दुपट्टा सहित',
      slug: 'embroidered-anarkali-kurta-set-with-dupatta',
      description: 'Stunning floor-length Anarkali kurta crafted in georgette with intricate zari neck embroidery, matching pant, and organza dupatta.',
      descriptionNe: 'जरी कढाई भएको आकर्षक अनारकली कुर्ता, म्याचिङ प्यान्ट र ओर्गान्जा दुपट्टा सहितको पूर्ण सेट।',
      brand: 'Shree Traders Premium',
      price: 5200,
      discountPrice: 4250,
      stock: 5,
      lowStockLimit: 3,
      featuredCategory: 'KURTAS',
      homepagePriority: 10,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Rose Wine', colorHex: '#881337' },
          { colorName: 'Peacock Teal', colorHex: '#0f766e' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'M (38)' },
          { sizeName: 'L (40)' },
          { sizeName: 'XL (42)' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod3.colors) {
    for (const s of prod3.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod3.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 1,
        },
      });
    }
  }

  // Product 4: Men's Pure Cotton Casual Shirt
  const prod4 = await prisma.product.create({
    data: {
      categoryId: catMens.id,
      name: "Men's Premium Pure Cotton Casual Shirt",
      nameNe: 'पुरुषहरूका लागि शुद्ध कटन क्याजुअल सर्ट',
      slug: 'mens-premium-pure-cotton-casual-shirt',
      description: 'Breathable 100% combed cotton men casual shirt tailored for comfortable daily wear and office in Damak. Easy to wash and durable.',
      descriptionNe: '१००% शुद्ध कटन कपडाबाट बनेको पुरुषहरूको क्याजुअल सर्ट, दैनिक कार्यालय तथा घुमघामका लागि अत्यन्तै आरामदायी।',
      brand: 'Shree Men',
      price: 1950,
      discountPrice: 1499,
      stock: 9,
      lowStockLimit: 3,
      featuredCategory: 'MENS',
      homepagePriority: 9,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Navy Blue', colorHex: '#1e3a8a' },
          { colorName: 'Olive Green', colorHex: '#3f6212' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'M' },
          { sizeName: 'L' },
          { sizeName: 'XL' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod4.colors) {
    for (const s of prod4.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod4.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 2,
        },
      });
    }
  }

  // Product 5: Men's Traditional Kurta Pyjama Set
  const prod5 = await prisma.product.create({
    data: {
      categoryId: catMens.id,
      name: "Men's Traditional Kurta Pyjama Set with Nehru Pocket",
      nameNe: 'पुरुष परम्परागत कुर्ता सुरुवाल सेट',
      slug: 'mens-traditional-kurta-pyjama-set',
      description: 'Elegant festive kurta pyjama set for men. Perfect for Dashain, Tihar, weddings, and traditional ceremonies in Damak and Jhapa.',
      descriptionNe: 'विवाह, चाडपर्व तथा विशेष उत्सवका लागि पुरुषहरूको परम्परागत कुर्ता सुरुवाल सेट।',
      brand: 'Shree Heritage Men',
      price: 3400,
      discountPrice: 2750,
      stock: 6,
      lowStockLimit: 2,
      featuredCategory: 'MENS',
      homepagePriority: 8,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Golden Cream', colorHex: '#fef08a' },
          { colorName: 'Royal Maroon', colorHex: '#881337' },
        ],
      },
      sizes: {
        create: [
          { sizeName: '38 (M)' },
          { sizeName: '40 (L)' },
          { sizeName: '42 (XL)' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod5.colors) {
    for (const s of prod5.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod5.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 1,
        },
      });
    }
  }

  // Product 6: Kids' Festive Kurta Suruwal Set for Boys
  const prod6 = await prisma.product.create({
    data: {
      categoryId: catKids.id,
      name: "Kids' Festive Kurta Suruwal Set for Boys",
      nameNe: 'बालकहरूका लागि आकर्षक कुर्ता सुरुवाल सेट',
      slug: 'kids-festive-kurta-suruwal-boys',
      description: 'Soft cotton-blend festive kurta suruwal set for young boys. Gentle on kids skin with easy button openings and bright colors.',
      descriptionNe: 'बालबालिकाका लागि नरम र छाला नघोच्ने कटन कुर्ता सुरुवाल सेट, चाडपर्व तथा पूजाका लागि उत्तम।',
      brand: 'Shree Kids',
      price: 2200,
      discountPrice: 1699,
      stock: 8,
      lowStockLimit: 3,
      featuredCategory: 'KIDS',
      homepagePriority: 9,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Bright Mustard', colorHex: '#eab308' },
          { colorName: 'Royal Blue', colorHex: '#1d4ed8' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'Age 2-4 Yrs' },
          { sizeName: 'Age 5-7 Yrs' },
          { sizeName: 'Age 8-10 Yrs' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod6.colors) {
    for (const s of prod6.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod6.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 2,
        },
      });
    }
  }

  // Product 7: Kids' Embroidered Festive Frock & Lehenga for Girls
  const prod7 = await prisma.product.create({
    data: {
      categoryId: catKids.id,
      name: "Kids' Embroidered Festive Party Frock & Lehenga Set",
      nameNe: 'बालिका पार्टी फ्रक तथा लंहेंगा सेट',
      slug: 'kids-embroidered-festive-lehenga-girls',
      description: 'Adorable festive flared party dress with light sequin and floral embroidery. Designed with soft inner lining for child comfort.',
      descriptionNe: 'साना नानीहरूका लागि पार्टी तथा चाडपर्वमा लगाउने सुन्दर फ्रक तथा लंहेंगा सेट।',
      brand: 'Shree Kids',
      price: 2500,
      discountPrice: 1999,
      stock: 6,
      lowStockLimit: 2,
      featuredCategory: 'KIDS',
      homepagePriority: 8,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
      colors: {
        create: [
          { colorName: 'Candy Pink', colorHex: '#f43f5e' },
          { colorName: 'Festive Red', colorHex: '#dc2626' },
        ],
      },
      sizes: {
        create: [
          { sizeName: 'Age 3-5 Yrs' },
          { sizeName: 'Age 6-8 Yrs' },
          { sizeName: 'Age 9-12 Yrs' },
        ],
      },
    },
    include: { colors: true, sizes: true },
  });

  for (const c of prod7.colors) {
    for (const s of prod7.sizes) {
      await prisma.productVariant.create({
        data: {
          productId: prod7.id,
          colorId: c.id,
          sizeId: s.id,
          stock: 1,
        },
      });
    }
  }

  // Product 8: Men's Leather Belt & Cap
  await prisma.product.create({
    data: {
      categoryId: catAccessories.id,
      name: "Men's Genuine Leather Belt & Cotton Cap Combo",
      nameNe: 'पुरुष लेदर बेल्ट तथा कटन क्याप कम्बो',
      slug: 'mens-leather-belt-and-cap-combo',
      description: 'Durable automatic buckle genuine leather belt paired with an adjustable high-quality casual cotton sun cap.',
      brand: 'Shree Accessories',
      price: 1600,
      discountPrice: 1250,
      stock: 10,
      lowStockLimit: 3,
      featuredCategory: 'MENS',
      homepagePriority: 6,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
    },
  });

  // Product 9: Bridal Clutch Purse
  await prisma.product.create({
    data: {
      categoryId: catPurses.id,
      name: 'Embroidered Velvet Bridal Clutch Purse',
      nameNe: 'मखमली दुलही क्लच पर्स',
      slug: 'embroidered-velvet-bridal-clutch-purse',
      description: 'Premium hand-embroidered golden thread velvet clutch with detachable chain strap. Fits phone, cards, and makeup essentials.',
      brand: 'Shree Accessories',
      price: 1900,
      discountPrice: 1450,
      stock: 7,
      lowStockLimit: 3,
      featuredCategory: null,
      homepagePriority: 5,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
    },
  });

  // Product 10: Cosmetics Kit
  await prisma.product.create({
    data: {
      categoryId: catCosmetics.id,
      name: 'Waterproof Matte Lipstick & Kajal Beauty Kit',
      nameNe: 'वाटरप्रुफ म्याट लिपस्टिक तथा गाजल किट',
      slug: 'waterproof-matte-lipstick-kajal-kit',
      description: 'Complete daily beauty kit featuring smudge-proof herbal kajal and long-lasting hydrating matte liquid lipsticks.',
      brand: 'Shree Glamour',
      price: 1650,
      discountPrice: 1250,
      stock: 15,
      lowStockLimit: 5,
      featuredCategory: null,
      homepagePriority: 4,
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800', isPrimary: true },
        ],
      },
    },
  });

  console.log('--- Seeding Discounts ---');
  await prisma.discount.create({
    data: {
      title: 'Damak Opening Festive Offer (१०% छुट)',
      code: 'SHREE10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      active: true,
    },
  });

  console.log('Database seeded with Women, Men, Kids, and Accessories successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
