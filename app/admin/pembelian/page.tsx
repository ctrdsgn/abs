import { ShoppingCart } from "lucide-react";
import { requireAdminPage } from "@/lib/admin-guard";
import { PurchasesCrud } from "@/components/admin/PurchasesCrud";

export default async function AdminPembelianPage() {
  await requireAdminPage();
  if (process.env.PURCHASE_MODULE_ENABLED !== "true") {
    return (
      <div className="mx-auto mt-20 max-w-xl rounded-2xl border bg-white p-10 text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-gray-400" />
        <h1 className="mt-4 text-xl font-bold">Modul Pembelian Tidak Aktif</h1>
        <p className="mt-2 text-sm text-gray-600">
          Aktifkan modul ini dengan mengubah PURCHASE_MODULE_ENABLED=true di file .env.local
        </p>
      </div>
    );
  }
  return <PurchasesCrud />;
}
