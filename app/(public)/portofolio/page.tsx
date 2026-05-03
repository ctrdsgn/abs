"use client";

import { useState, useEffect } from "react";

export default function PortofolioPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    loadPortfolios();
  }, []);

  async function loadPortfolios(type?: string) {
    setLoading(true);
    const url = type && type !== "Semua" ? `/api/portfolio?type=${type}` : "/api/portfolio";
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error("Failed to load portfolios:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleTabClick(tab: string) {
    setActiveTab(tab);
    const typeMap: { [key: string]: string } = {
      "Rumah": "RUMAH",
      "Kafe": "KAFE",
      "Sekolah": "SEKOLAH",
      "Kantor": "KANTOR",
      "Lainnya": "LAINNYA",
    };
    loadPortfolios(typeMap[tab]);
  }

  return (
    <main className="pt-20">
      <section className="bg-white px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">Portofolio Azzam Barokah Steel</h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600">Galeri hasil karya terbaik stainless steel: pagar, pintu, tangga, canopy, balkon, dan kubah mesjid.</p>
          <div className="mt-8 flex gap-6 border-b border-brand-primary/20 text-sm font-semibold text-gray-600">
            {["Semua", "Rumah", "Kafe", "Sekolah", "Kantor", "Lainnya"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`pb-3 transition-all duration-200 ${
                  activeTab === tab ? "border-b-2 border-brand-primary text-brand-primary" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-8 columns-2 gap-4 md:columns-3">
            {portfolios.length > 0 ? (
              portfolios.map((portfolio: any) => (
                <article
                  key={portfolio.id}
                  className="group relative mb-4 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {portfolio.image ? (
                    <img
                      src={portfolio.image}
                      alt={portfolio.title}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ height: "auto", aspectRatio: "4/3" }}
                    />
                  ) : (
                    <div
                      className="w-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center"
                      style={{ height: "auto", aspectRatio: "4/3" }}
                    >
                      <div className="text-2xl">🪵</div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-brand-dark/80 p-4 text-white transition-all duration-300 group-hover:translate-y-0">
                    <p className="text-sm font-semibold">{portfolio.title}</p>
                    <p className="text-xs text-white/80">{portfolio.projectType}</p>
                    {portfolio.location && (
                      <p className="text-xs text-white/60 mt-1">{portfolio.location}</p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🪵</div>
                <p className="text-lg font-semibold text-brand-dark">Belum ada portofolio di kategori ini</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
