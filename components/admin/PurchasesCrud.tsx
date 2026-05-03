"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { formatDate, formatRupiah } from "@/lib/utils";

type Purchase = { id: string; date: string; itemName: string; quantity: number; unit: string; unitPrice: number; totalPrice: number };

export function PurchasesCrud() {
  const [items, setItems] = useState<Purchase[]>([]);

  async function load() {
    const response = await fetch("/api/purchases");
    setItems(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: String(form.get("date")),
        itemName: String(form.get("itemName")),
        category: String(form.get("category")),
        quantity: Number(form.get("quantity")),
        unit: String(form.get("unit")),
        unitPrice: Number(form.get("unitPrice")),
      }),
    });
    event.currentTarget.reset();
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus pembelian ini?")) return;
    await fetch(`/api/purchases/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <section>
      <AdminHeader title="Input Pembelian" subtitle="Kelola data pembelian bahan baku" />
      <form onSubmit={onCreate} className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-6">
        <input name="date" type="date" required className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="itemName" required placeholder="Nama barang" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="category" placeholder="Kategori" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="quantity" type="number" step="0.1" required placeholder="Jumlah" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="unit" required placeholder="Satuan" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="unitPrice" type="number" required placeholder="Harga" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <button className="md:col-span-6 rounded-full bg-[#1B4332] px-6 py-3 font-semibold text-white">Tambah Pembelian</button>
      </form>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="px-4 py-3">Tanggal</th><th className="px-4 py-3">Barang</th><th className="px-4 py-3">Jumlah</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Aksi</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{formatDate(item.date)}</td>
                <td className="px-4 py-3 font-semibold text-[#0A1628]">{item.itemName}</td>
                <td className="px-4 py-3">{item.quantity} {item.unit}</td>
                <td className="px-4 py-3">{formatRupiah(item.unitPrice)}</td>
                <td className="px-4 py-3">{formatRupiah(item.totalPrice)}</td>
                <td className="px-4 py-3"><button onClick={() => onDelete(item.id)} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
