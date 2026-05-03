import Link from "next/link";
import { Search } from "lucide-react";
import { formatPriceRange } from "@/lib/utils";

async function getProducts() {
  const response = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/products`, {
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

export default async function KatalogPage() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#0A1628] via-[#1B4332] to-[#0A1628] px-4 py-12 md:px-8 md:py-20">
          <div className="mx-auto w-full max-w-[1280px]">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Katalog Produk</h1>
          </div>
        </section>
        <section className="px-4 py-12 text-center md:py-20">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="text-6xl">⚙️</div>
            <p className="mt-4 text-lg font-semibold text-[#0A1628]">Belum ada produk di kategori ini</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-[#0A1628] via-[#1B4332] to-[#0A1628] px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="text-sm font-semibold text-white/70">Beranda / Katalog</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">Katalog Produk Stainless Steel</h1>
        </div>
      </section>
      <section className="bg-[#F8F5F0] px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["Semua", "Pagar", "Pintu", "Tangga", "Canopy", "Custom"].map((cat, index) => (
                <button
                  key={cat}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    index === 0 ? "bg-[#1B4332] text-white" : "border border-[#1B4332] text-[#1B4332]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]" size={16} />
              <input
                className="w-full rounded-full border border-[#1B4332] bg-white py-3 pl-10 pr-4 text-sm text-[#4B5563] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                placeholder="Cari produk..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/20"
              >
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-primary shadow-lg backdrop-blur-sm">
                    {product.category}
                  </span>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="aspect-square w-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                      <div className="text-4xl">🪵</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Link
                      href={`/katalog/${product.id}`}
                      className="block w-full rounded-full bg-white/90 py-2 text-center text-sm font-semibold text-brand-primary shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <h2 className="text-xl font-bold text-brand-dark transition-colors group-hover:text-brand-primary">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-2xl font-black text-brand-secondary">
                    {formatPriceRange(product.priceMin, product.priceMax)}
                  </p>
                </div>
                <Link
                  href={`/katalog/${product.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Lihat detail ${product.name}`}
                />
                <div className="rounded-b-3xl bg-gradient-to-r from-brand-primary to-brand-secondary p-1">
                  <div className="rounded-b-2xl bg-white py-3 text-center">
                    <span className="text-sm font-semibold text-brand-primary">Lihat Detail</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
