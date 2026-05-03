import Link from "next/link";
import { formatPriceRange } from "@/lib/utils";

async function getFeaturedProducts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/products?featured=true&limit=6`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return (
    <main className="pt-20">
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#1B4332] to-[#0A1628] px-4 py-12 text-white md:px-8">
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl animate-pulse" />
        <div className="mx-auto flex min-h-[80vh] w-full max-w-[1280px] items-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
              Stainless Steel <span className="text-orange-500">Custom</span> Berkualitas
            </h1>
            <div className="mt-2 h-1 w-40 rounded-full bg-orange-500" />
          <p className="mt-6 max-w-2xl text-white/80">
            Pagar, pintu, tempat tidur, tangga, canopy, balkon, alat medis, baja ringan, trush, hingga kubah mesjid — kami wujudkan pesanan stainless steel impian Anda di Dumai, Riau.
          </p>
            <div className="mt-10 flex w-full flex-col gap-4 md:w-auto md:flex-row">
              <Link
                href="/katalog"
                className="rounded-full bg-[#D4A017] px-8 py-4 text-center font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#b8860b]"
              >
              Lihat Katalog
            </Link>
            <a
              href="https://wa.me/6282385597262"
              target="_blank"
              rel="noopener noreferrer"
                className="rounded-full border-2 border-white px-8 py-4 text-center font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              Chat WhatsApp
            </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80">↓</div>
      </section>

      <section className="bg-[#F5F0E8] px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto grid w-full max-w-[1280px] gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-[#0A1628] md:text-5xl">Tentang Azzam Barokah Steel</h2>
            <p className="mt-4 text-base leading-relaxed text-[#4B5563]">
              Azzam Barokah Steel adalah workshop stainless steel yang melayani pesanan custom berkualitas tinggi untuk kebutuhan residensial, komersial, medis, dan religius.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["5+ Tahun", "500+ Proyek", "4.5★ Google"].map((chip) => (
                <span key={chip} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1B4332] shadow-sm">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#D4A017] text-6xl text-white shadow-xl">
            🪑
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <h2 className="text-4xl font-bold tracking-tight text-[#0A1628] md:text-5xl">Produk Unggulan</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
            {products.map((product: any) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-t-2xl bg-gray-100">
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1B4332] backdrop-blur">
                    {product.category}
                  </div>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="aspect-square w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center">
                      <div className="text-4xl">⚙️</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mt-1 text-xl font-semibold text-[#0A1628]">{product.name}</h3>
                  <p className="mt-1 text-2xl font-black text-[#D4A017]">
                    {formatPriceRange(product.priceMin, product.priceMax)}
                  </p>
                </div>
                <Link
                  href={`/katalog/${product.id}`}
                  className="block rounded-b-2xl bg-[#1B4332] px-4 py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-[#D4A017]"
                >
                  Lihat Detail
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
