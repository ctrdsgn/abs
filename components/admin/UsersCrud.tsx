"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";

type User = { id: string; name: string; email: string; role: "SUPER_ADMIN" | "STAFF" };

export function UsersCrud() {
  const [items, setItems] = useState<User[]>([]);

  async function load() {
    const response = await fetch("/api/users");
    setItems(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        role: String(form.get("role")),
      }),
    });
    event.currentTarget.reset();
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus pengguna ini?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    load();
  }

  async function onEdit(item: User) {
    const name = prompt("Nama pengguna", item.name);
    if (!name) return;
    const role = prompt("Role (STAFF atau SUPER_ADMIN)", item.role) as "STAFF" | "SUPER_ADMIN" | null;
    if (!role) return;
    await fetch(`/api/users/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });
    load();
  }

  return (
    <section>
      <AdminHeader title="Manajemen Pengguna" subtitle="Kelola akun staff dan admin" />
      <form onSubmit={onCreate} className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
        <input name="name" required placeholder="Nama" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <input name="password" type="password" required placeholder="Password" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]" />
        <select name="role" className="rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#1B4332]"><option value="STAFF">STAFF</option><option value="SUPER_ADMIN">SUPER_ADMIN</option></select>
        <button className="md:col-span-4 rounded-full bg-[#1B4332] px-6 py-3 font-semibold text-white">Tambah Pengguna</button>
      </form>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Aksi</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-[#0A1628]">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(item)} className="rounded-full bg-[#1B4332] px-3 py-1 text-xs font-semibold text-white">Edit</button>
                    <button onClick={() => onDelete(item.id)} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
