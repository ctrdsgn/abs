"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { Modal } from "@/components/ui/Modal";
import { formatPriceRange } from "@/lib/utils";
import { Upload, X, Plus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions?: string;
  material?: string;
  priceMin: number;
  priceMax: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { id: string; url: string; sortOrder: number }[];
};

type ProductFormData = {
  name: string;
  category: string;
  description: string;
  dimensions: string;
  material: string;
  priceMin: number;
  priceMax: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
};

export function ProductsCrud() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadInputKey, setUploadInputKey] = useState(0);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/products?includeInactive=true");
    const data = await response.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      let message = text;
      try {
        const json = JSON.parse(text);
        message = json.error || JSON.stringify(json);
      } catch {
        // Keep raw text if not JSON
      }
      message = message.replace(/^Upload gagal:\s*/i, "");
      message = message.replace(/^Gagal mengupload gambar:\s*/i, "");
      throw new Error(`Upload gagal: ${message}`);
    }

    const data = await response.json();
    if (!data?.url) {
      throw new Error("Upload gagal: respons tidak berisi URL gambar");
    }
    return data.url;
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    setUploadingImages(true);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadImage(files[i]);
        urls.push(url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    setUploadingImages(false);

    // Add to current form images
    const currentImages = editingProduct?.images.map(img => img.url) || [];
    setFormData(prev => ({ ...prev, images: [...currentImages, ...urls] }));
    
    // Reset input so same file can be selected again
    setUploadInputKey(prev => prev + 1);
  }

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    dimensions: "",
    material: "",
    priceMin: 0,
    priceMax: 0,
    isActive: true,
    isFeatured: false,
    images: [],
  });

  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      dimensions: "",
      material: "",
      priceMin: 0,
      priceMax: 0,
      isActive: true,
      isFeatured: false,
      images: [],
    });
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      dimensions: product.dimensions || "",
      material: product.material || "",
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      images: product.images.map(img => img.url),
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...formData,
      images: formData.images.map((url, index) => ({ url, sortOrder: index })),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Submit failed:", error);
        alert(`Gagal menyimpan produk: ${error}`);
        return;
      }

      setIsModalOpen(false);
      load();
    } catch (error) {
      console.error("Submit error:", error);
      alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    load();
  }

  return (
    <section>
      <AdminHeader title="Manajemen Produk" subtitle="Tambah, lihat, dan hapus produk" />
      <div className="mb-6 flex justify-end">
        <button
          onClick={openAddModal}
          className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition-all hover:bg-green-800"
        >
          <Plus className="mr-2 inline h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-brand-dark">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-t transition hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{item.name}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3 font-bold text-brand-secondary">
                    {formatPriceRange(item.priceMin, item.priceMax)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(item.id, item.isActive)}
                        className="rounded-full bg-gray-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Produk" : "Tambah Produk"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <input
                type="text"
                required
                list="categories"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <datalist id="categories">
                <option value="Kursi" />
                <option value="Meja" />
                <option value="Lemari" />
                <option value="Rak" />
                <option value="Tempat Tidur" />
                <option value="Custom" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dimensi</label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="contoh: 100cm x 50cm x 75cm"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="contoh: Kayu Jati"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga Minimum</label>
              <input
                type="number"
                required
                min="0"
                value={formData.priceMin}
                onChange={(e) => setFormData({ ...formData, priceMin: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga Maximum</label>
              <input
                type="number"
                required
                min="0"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Aktif
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {formData.images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-primary transition">
                  <input
                    key={uploadInputKey}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-gray-400" />
                </label>
              )}
            </div>
            {uploadingImages && <p className="text-sm text-gray-600">Mengupload gambar...</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
