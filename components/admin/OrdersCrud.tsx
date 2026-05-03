"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { formatDate } from "@/lib/utils";

type Order = { id: string; customerName: string; whatsapp: string; furnitureType: string; status: string; budget?: string | null; createdAt: string };

export function OrdersCrud() {
  const [items, setItems] = useState<Order[]>([]);

  async function load() {
    const response = await fetch("/api/orders");
    setItems(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <section>
      <AdminHeader title="Order Masuk" subtitle="Pantau dan ubah status order pelanggan" />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Jenis Pesanan</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Tanggal</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-[#0A1628]">{item.customerName}</td>
                <td className="px-4 py-3">{item.whatsapp}</td>
                <td className="px-4 py-3">{item.furnitureType}</td>
                <td className="px-4 py-3">{item.budget ?? "-"}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#1B4332]"
                  >
                    <option value="BARU">BARU</option><option value="DIPROSES">DIPROSES</option><option value="DIKONFIRMASI">DIKONFIRMASI</option><option value="SELESAI">SELESAI</option><option value="DIBATALKAN">DIBATALKAN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
