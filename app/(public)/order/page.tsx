"use client";

import { FormEvent, useState } from "react";

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      furnitureType: String(form.get("furnitureType") ?? ""),
      description: String(form.get("description") ?? ""),
      budget: String(form.get("budget") ?? ""),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!response.ok) {
      setError("Gagal mengirim pesanan.");
      return;
    }
    setSuccessName(payload.customerName);
  }

  if (successName) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="mt-4 text-3xl font-bold">Pesanan Berhasil Dikirim!</h1>
        <p className="mt-2">
          Terima kasih, {successName}! Tim kami akan menghubungi Anda via WhatsApp dalam 1×24 jam.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-dark">Request Custom Order Stainless Steel</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input name="customerName" required minLength={3} className="w-full rounded-xl border px-4 py-3" placeholder="Nama Lengkap" />
        <input name="whatsapp" required className="w-full rounded-xl border px-4 py-3" placeholder="Nomor WhatsApp" />
        <select name="furnitureType" required className="w-full rounded-xl border px-4 py-3 bg-white">
          <option value="">Pilih Jenis Pesanan</option>
          <option>Pagar</option>
          <option>Pintu</option>
          <option>Tempat Tidur</option>
          <option>Tangga</option>
          <option>Canopy</option>
          <option>Balkon</option>
          <option>Alat Medis</option>
          <option>Baja Ringan/Trush</option>
          <option>Kubah Mesjid</option>
          <option>Lainnya</option>
        </select>
        <textarea name="description" required minLength={20} rows={4} className="w-full rounded-xl border px-4 py-3" placeholder="Deskripsi Kebutuhan (ukuran, spesifikasi, desain, dll)" />
        <input name="budget" className="w-full rounded-xl border px-4 py-3" placeholder="cth: Rp 2.000.000 – Rp 3.000.000" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white">
          {loading ? "Mengirim..." : "Kirim Pesanan"}
        </button>
      </form>
    </main>
  );
}
