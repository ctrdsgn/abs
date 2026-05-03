import { requireAdminPage } from "@/lib/admin-guard";
import { ReportsClient } from "@/components/admin/ReportsClient";

export default async function AdminLaporanPage() {
  await requireAdminPage();
  return <ReportsClient />;
}
