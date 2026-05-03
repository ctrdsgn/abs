"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { formatRupiah } from "@/lib/utils";

export function ReportsClient() {
  const [salesCount, setSalesCount] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const [salesRes, purchaseRes] = await Promise.all([fetch("/api/reports/sales"), fetch("/api/reports/purchases")]);
      const sales = await salesRes.json();
      const purchases = await purchaseRes.json();
      setSalesCount(sales.total ?? 0);
      setPurchaseTotal(purchases.sum ?? 0);
    }
    load();
  }, []);

  return (
    <section>
      <AdminHeader title="Laporan" subtitle="Ringkasan penjualan dan pembelian" />
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border-l-4 border-[#1B4332] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Total Order</p>
          <p className="mt-2 text-3xl font-bold text-[#0A1628]">{salesCount}</p>
        </article>
        <article className="rounded-2xl border-l-4 border-[#D4A017] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Total Pembelian</p>
          <p className="mt-2 text-3xl font-bold text-[#0A1628]">{formatRupiah(purchaseTotal)}</p>
        </article>
      </div>
    </section>
  );
}
