"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildWAUrl, formatPriceRange } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions?: string;
  material?: string;
  priceMin: number;
  priceMax: number;
  images: { id: string; url: string; sortOrder: number }[];
};

export default function ProductDetailPage({ params }: Params) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          setError("Produk tidak ditemukan");
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Terjadi kesalahan saat memuat produk");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  if (loading) {
    return <main className="py-20 text-center">Memuat...</main>;
  }

  if (error || !product) {
    return <main className="py-20 text-center">{error || "Produk tidak ditemukan"}</main>;
  }

  return <ProductDetailClient product={product} />;
}

function ProductDetailClient({ product }: { product: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 lg:px-16">
      <div className="space-y-4">
        {/* Image Slider */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[currentImageIndex].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {product.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`h-2 w-2 rounded-full transition ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl">🪵</div>
                <p>Tidak ada gambar</p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image: any, index: number) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  index === currentImageIndex ? "border-brand-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  className="h-16 w-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="inline-flex rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-primary">
          {product.category}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-brand-dark">{product.name}</h1>
        <p className="mt-3 text-2xl font-bold text-brand-secondary">
          {formatPriceRange(product.priceMin, product.priceMax)}
        </p>
        {product.dimensions && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">Dimensi:</span> {product.dimensions}
          </p>
        )}
        {product.material && (
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-semibold">Material:</span> {product.material}
          </p>
        )}
        <p className="mt-6 whitespace-pre-wrap text-gray-700">{product.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildWAUrl(`Halo Azzam Barokah Steel, saya tertarik dengan produk ${product.name}`)}  
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Pesan via WhatsApp
          </a>
          <Link
            href="/order"
            className="rounded-full border-2 border-brand-secondary px-6 py-3 text-center font-semibold text-brand-secondary transition hover:bg-brand-secondary hover:text-white"
          >
            Request Custom
          </Link>
        </div>
      </div>
    </main>
  );
}
