// @ts-nocheck
import { hash } from "bcryptjs";
import { OrderStatus, PrismaClient, ProjectType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Kreasi Kribo Database...");

  const adminPassword = await hash("Admin123!", 10);
  
  // 1. Users
  console.log("👤 Seeding users...");
  await prisma.user.upsert({
    where: { email: "admin@kreasikribo.com" },
    update: { name: "Super Admin", role: Role.SUPER_ADMIN },
    create: {
      name: "Super Admin",
      email: "admin@kreasikribo.com",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  // 2. Cleanup (Hanya model yang terdeteksi)
  console.log("🧹 Cleaning up old data...");
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.order.deleteMany();
  await prisma.purchase.deleteMany();
  // portfolioImage dilewati karena memang tidak ada di skema Anda

  // 3. Products & Images
  console.log("🛍️ Seeding products...");
  const product1 = await prisma.product.create({
    data: {
      name: "Kursi Cafe Minimalis",
      category: "Kursi",
      description: "Kursi custom untuk cafe dengan desain minimalis.",
      dimensions: "45x45x90 cm",
      material: "MDF",
      priceMin: 850000,
      priceMax: 1200000,
      isActive: true,
      isFeatured: true,
    }
  });

  await prisma.productImage.create({
    data: {
      productId: product1.id,
      url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
      sortOrder: 0
    }
  });

  // 4. Portfolio
  console.log("🖼️ Seeding portfolio...");
  await prisma.portfolio.createMany({
    data: [
      {
        title: "Interior Cafe Senja",
        projectType: ProjectType.KAFE,
        description: "Paket furnitur lengkap untuk area indoor cafe.",
        location: "Duri - Bengkalis",
        isFeatured: true,
      },
      {
        title: "Set Furnitur Rumah Tropis",
        projectType: ProjectType.RUMAH,
        description: "Set meja, kursi, dan rak keluarga.",
        location: "Bukit Datuk",
        isFeatured: true,
      }
    ]
  });

  // 5. Orders
  console.log("📝 Seeding orders...");
  await prisma.order.create({
    data: {
      customerName: "Budi Santoso",
      whatsapp: "081234567890",
      furnitureType: "Meja Cafe",
      description: "Butuh 8 meja cafe ukuran 80x80.",
      budget: "Rp 10.000.000 - Rp 14.000.000",
      status: OrderStatus.BARU,
    }
  });

  console.log("✅ Seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });