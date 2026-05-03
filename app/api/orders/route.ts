import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const countOnly = searchParams.get("countOnly") === "true";
  const today = searchParams.get("today") === "true";
  const thisMonth = searchParams.get("thisMonth") === "true";
  const now = new Date();
  const fromToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fromMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(today ? { createdAt: { gte: fromToday } } : {}),
    ...(thisMonth ? { createdAt: { gte: fromMonth } } : {}),
  };

  if (countOnly) {
    const count = await prisma.order.count({ where });
    return NextResponse.json({ count });
  }

  const rows = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.customerName || !body.whatsapp || !body.furnitureType || !body.description) {
    return NextResponse.json({ error: "Data wajib belum lengkap" }, { status: 400 });
  }
  const row = await prisma.order.create({ data: body });
  return NextResponse.json(row, { status: 201 });
}
