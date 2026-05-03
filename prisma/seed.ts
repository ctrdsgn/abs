import { hash } from "bcryptjs";
import { OrderStatus, PrismaClient, ProjectType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("Admin123!", 10);
  const staffPassword = await hash("Staff123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@kreasikribo.com" },
    update: {
      name: "Super Admin",
      password,
      role: Role.SUPER_ADMIN,
    },
    create: {
      name: "Super Admin",
      email: "admin@kreasikribo.com",
      password,
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@kreasikribo.com" },
    update: {
      name: "Staff Operasional",
      password: staffPassword,
      role: Role.STAFF,
    },
    create: {
      name: "Staff Operasional",
      email: "staff@kreasikribo.com",
      password: staffPassword,
      role: Role.STAFF,
    },
  });

  const materialMultipliers = {
    "Stainless Steel 304": 1.0,
    "Stainless Steel 316": 1.3,
    "Baja Ringan": 1.5,
  };

  const complexityMultipliers = {
    Standar: 1.0,
    Semi-Custom: 1.4,
    Full-Custom: 2.0,
  };

  await prisma.pricingConfig.upsert({
    where: { category: "Pagar" },
    update: {
      basePrice: 1500000,
      pricePerCm: 150,
      materialMultipliers,
      complexityMultipliers,
    },
    create: {
      category: "Pagar",
      basePrice: 1500000,
      pricePerCm: 150,
      materialMultipliers,
      complexityMultipliers,
    },
  });

  await prisma.pricingConfig.upsert({
    where: { category: "Pintu" },
    update: {
      basePrice: 2000000,
      pricePerCm: 200,
      materialMultipliers,
      complexityMultipliers,
    },
    create: {
      category: "Pintu",
      basePrice: 2000000,
      pricePerCm: 200,
      materialMultipliers,
      complexityMultipliers,
    },
  });

  await prisma.pricingConfig.upsert({
    where: { category: "Tangga" },
    update: {
      basePrice: 3000000,
      pricePerCm: 250,
      materialMultipliers,
      complexityMultipliers,
    },
    create: {
      category: "Tangga",
      basePrice: 3000000,
      pricePerCm: 250,
      materialMultipliers,
      complexityMultipliers,
    },
  });

  await prisma.product.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.order.deleteMany();
  await prisma.purchase.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Pagar Stainless Steel 304",
        category: "Pagar",
        description: "Pagar stainless steel desain modern dengan finishing premium.",
        dimensions: "Panjang sesuai kebutuhan",
        material: "Stainless Steel 304",
        priceMin: 2500000,
        priceMax: 5000000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Pintu Stainless Steel Minimalis",
        category: "Pintu",
        description: "Pintu stainless steel dengan desain minimalis untuk rumah modern.",
        dimensions: "Ukuran standar atau custom",
        material: "Stainless Steel 304",
        priceMin: 3500000,
        priceMax: 7000000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Tangga Stainless Steel",
        category: "Tangga",
        description: "Tangga stainless steel dengan desain elegan dan tahan lama.",
        dimensions: "Custom sesuai ruangan",
        material: "Stainless Steel 316",
        priceMin: 5000000,
        priceMax: 10000000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Canopy Stainless Steel",
        category: "Canopy",
        description: "Canopy stainless steel untuk halaman atau teras dengan desain custom.",
        dimensions: "Sesuai kebutuhan",
        material: "Stainless Steel 304",
        priceMin: 4000000,
        priceMax: 8500000,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Balkon Stainless Steel",
        category: "Balkon",
        description: "Balkon stainless steel dengan desain safety dan estetika tinggi.",
        dimensions: "Custom",
        material: "Stainless Steel 304",
        priceMin: 3000000,
        priceMax: 6500000,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Alat Medis Stainless Steel",
        category: "Alat Medis",
        description: "Peralatan medis stainless steel untuk klinik dan laboratorium.",
        dimensions: "Sesuai spesifikasi",
        material: "Stainless Steel 316 (Food Grade)",
        priceMin: 2500000,
        priceMax: 6000000,
        isActive: true,
        isFeatured: false,
      },
    ],
  });
        isFeatured: false,
      },
      {
        name: "Rak Dinding Stainless Steel",
        category: "Rak",
        description: "Rak dinding stainless steel untuk dapur, kamar mandi, atau display.",
        dimensions: "100x30x180 cm atau custom",
        material: "Stainless Steel 304",
        priceMin: 1800000,
        priceMax: 3500000,
        isActive: true,
        isFeatured: false,
      },
    ],
  });

  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80&sig=${product.id}`,
        sortOrder: 0,
      },
    });
  }

  await prisma.portfolio.createMany({
    data: [
      {
        title: "Pagar Stainless Steel Rumah Mewah",
        projectType: ProjectType.RUMAH,
        description: "Pagar stainless steel 304 dengan desain minimalis modern untuk rumah mewah.",
        location: "Bukit Datuk, Dumai",
        isFeatured: true,
      },
      {
        title: "Tangga Stainless Steel Gedung Kantor",
        projectType: ProjectType.KANTOR,
        description: "Tangga stainless steel 316 dengan design elegan untuk gedung kantor.",
        location: "Jl. Gatot Subroto, Dumai",
        isFeatured: true,
      },
      {
        title: "Kubah Mesjid Stainless Steel",
        projectType: ProjectType.LAINNYA,
        description: "Kubah mesjid custom stainless steel dengan tingkat precision tinggi.",
        location: "Dumai Kota",
        isFeatured: true,
      },
    ],
  });

  const portfolios = await prisma.portfolio.findMany();
  for (const item of portfolios) {
    await prisma.portfolioImage.create({
      data: {
        portfolioId: item.id,
        url: `https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80&sig=${item.id}`,
        sortOrder: 0,
      },
    });
  }

  await prisma.order.createMany({
    data: [
      {
        customerName: "Budi Santoso",
        whatsapp: "081234567890",
        furnitureType: "Pagar",
        description: "Butuh pagar stainless steel 304 ukuran panjang 20 meter, tinggi 1.5 meter dengan desain minimalis modern.",
        budget: "Rp 8.000.000 - Rp 12.000.000",
        status: OrderStatus.BARU,
      },
      {
        customerName: "Sari Wulandari",
        whatsapp: "082212223333",
        furnitureType: "Tangga",
        description: "Tangga stainless steel 316 untuk gedung kantor, 2 lantai dengan railing safety.",
        budget: "Rp 15.000.000 - Rp 20.000.000",
        status: OrderStatus.DIPROSES,
      },
      {
        customerName: "Ahmad Fauzi",
        whatsapp: "087771112222",
        furnitureType: "Kubah Mesjid",
        description: "Kubah mesjid stainless steel diameter 3 meter dengan finishing chrome premium.",
        budget: "Rp 25.000.000 - Rp 35.000.000",
        status: OrderStatus.SELESAI,
      },
    ],
  });

  await prisma.purchase.createMany({
    data: [
      {
        date: new Date(),
        itemName: "Stainless Steel Plate 304",
        category: "Material",
        quantity: 50,
        unit: "kg",
        unitPrice: 250000,
        totalPrice: 12500000,
        supplier: "PT Stainless Indonesia",
        notes: "Material premium untuk pagar dan pintu",
      },
      {
        date: new Date(),
        itemName: "Baja Ringan Trush",
        category: "Baja",
        quantity: 20,
        unit: "liter",
        unitPrice: 95000,
        totalPrice: 1900000,
        supplier: "Toko Bangunan Maju",
        notes: "Warna walnut",
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
