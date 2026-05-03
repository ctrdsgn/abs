import { requireAdminPage } from "@/lib/admin-guard";
import { PortfolioCrud } from "@/components/admin/PortfolioCrud";

export default async function AdminPortofolioPage() {
  await requireAdminPage();
  return <PortfolioCrud />;
}
