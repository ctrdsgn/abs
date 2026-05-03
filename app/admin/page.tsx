import { requireAdminPage } from "@/lib/admin-guard";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  return <DashboardClient />;
}
