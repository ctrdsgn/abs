import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  const rows = await prisma.pricingConfig.findMany({ orderBy: { category: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const body = await request.json();
  const row = await prisma.pricingConfig.create({
    data: {
      category: body.category,
      basePrice: Number(body.basePrice ?? 500000),
      pricePerCm: Number(body.pricePerCm ?? 50),
      materialMultipliers: body.materialMultipliers ?? { Triplek: 1.0 },
      complexityMultipliers: body.complexityMultipliers ?? { Simple: 1.0, Standar: 1.3, Premium: 1.7 },
    },
  });
  return NextResponse.json(row, { status: 201 });
}
