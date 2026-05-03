"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";

export function DashboardClient() {
  const [stats, setStats] = useState({ products: 0, portfolio: 0, orders: 0, purchases: 0 });

  useEffect(() => {
    async function load() {
      const [p1, p2, p3, p4] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/portfolio"),
        fetch("/api/orders"),
        fetch("/api/purchases"),
      ]);
      const [products, portfolio, orders, purchases] = await Promise.all([p1.json(), p2.json(), p3.json(), p4.json()]);
      setStats({
        products: products.length ?? 0,
        portfolio: portfolio.length ?? 0,
        orders: orders.length ?? 0,
        purchases: purchases.length ?? 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Produk", value: stats.products, color: "border-[#1B4332]" },
    { label: "Portofolio", value: stats.portfolio, color: "border-[#D4A017]" },
    { label: "Order", value: stats.orders, color: "border-[#1B4332]" },
    { label: "Pembelian", value: stats.purchases, color: "border-[#D4A017]" },
  ];

  return (
    <section>
      <AdminHeader title="Dashboard" subtitle="Ringkasan data operasional terbaru" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border-l-4 ${card.color} bg-white p-5 shadow-sm`}>
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#0A1628]">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
