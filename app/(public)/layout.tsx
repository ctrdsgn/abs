import Link from "next/link";
import { TreePine } from "lucide-react";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#4B5563]">
      <PublicNavbar />
      {children}
      <footer className="bg-[#0A1628] text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-20 md:grid-cols-3 md:px-8">
          <div>
            <p className="flex items-center gap-2 text-xl font-bold text-orange-400">
              <TreePine className="h-5 w-5" /> Azzam Barokah Steel
            </p>
            <p className="mt-2 text-sm text-white/80">
              Pesanan stainless steel berkualitas tinggi: pagar, pintu, tempat tidur, tangga, canopy, balkon, alat medis, baja ringan, trush, dan kubah mesjid.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Tautan Cepat</p>
            {[
              { href: "/", label: "Beranda" },
              { href: "/katalog", label: "Katalog" },
              { href: "/portofolio", label: "Portofolio" },
              { href: "/tentang", label: "Tentang Kami" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-white/80 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="font-semibold text-white">Kontak</p>
            <p>Jl. Nelayan Laut, Dumai, Riau</p>
            <a href="tel:082385597262" className="block hover:text-white">
              0823-8559-7262
            </a>
            <p>Senin-Sabtu 08.00-17.30</p>
          </div>
        </div>
        <div className="border-t border-white/20 py-4 text-center text-xs">
          © 2026 Azzam Barokah Steel. All rights reserved.
        </div>
      </footer>
      <WhatsAppFloat />
    </div>
  );
}
