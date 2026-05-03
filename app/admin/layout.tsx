import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) return <>{children}</>;

  const showPurchase = process.env.PURCHASE_MODULE_ENABLED === "true";

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="w-64 bg-brand-dark p-6 text-white">
        <p className="text-xl font-bold text-orange-600">Azzam Barokah Steel Admin</p>
        <nav className="mt-8 space-y-2 text-sm">
          <Link href="/admin" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Dashboard
          </Link>
          <Link href="/admin/produk" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Produk
          </Link>
          <Link href="/admin/portofolio" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Portofolio
          </Link>
          <Link href="/admin/order" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Order Masuk
          </Link>
          {showPurchase && (
            <Link href="/admin/pembelian" className="block rounded-lg px-3 py-2 hover:bg-white/10">
              Pembelian
            </Link>
          )}
          <Link href="/admin/laporan" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Laporan
          </Link>
          {session.user.role === "SUPER_ADMIN" && (
            <Link href="/admin/pengguna" className="block rounded-lg px-3 py-2 hover:bg-white/10">
              Pengguna
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
