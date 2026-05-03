import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const includeInactive = searchParams.get("includeInactive") === "true";
  const limit = Number(searchParams.get("limit") ?? "0");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
      ...(includeInactive ? {} : { isActive: true }),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;

  const body = await request.json();
  const { images = [], ...data } = body;

  const product = await prisma.product.create({
    data: {
      ...data,
      images: {
        create: images.map((img: { url: string; sortOrder?: number }, idx: number) => ({
          url: img.url,
          sortOrder: img.sortOrder ?? idx,
        })),
      },
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(product, { status: 201 });
}
