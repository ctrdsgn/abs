import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const rows = await prisma.purchase.findMany({
    where: {
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const body = await request.json();
  const totalPrice = Math.round(Number(body.quantity) * Number(body.unitPrice));
  const row = await prisma.purchase.create({
    data: {
      ...body,
      date: new Date(body.date),
      quantity: Number(body.quantity),
      unitPrice: Number(body.unitPrice),
      totalPrice,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
