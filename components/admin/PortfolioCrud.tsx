"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { Modal } from "@/components/ui/Modal";
import { Upload, X, Plus } from "lucide-react";

type Portfolio = {
  id: string;
  title: string;
  projectType: string;
  description?: string;
  location?: string;
  image?: string;
  isFeatured: boolean;
};

type PortfolioFormData = {
  title: string;
  projectType: string;
  description: string;
  location: string;
  image: string;
  isFeatured: boolean;
};

export function PortfolioCrud() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [uploadError, setUploadError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/portfolio");
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
      let errorMessage = `Upload gagal (HTTP ${response.status})`;
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch {
        const text = await response.text();
        if (text) {
          errorMessage = text.replace(/^Upload gagal:\s*/i, "").replace(/^Gagal mengupload gambar:\s*/i, "");
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data?.url) {
      throw new Error("Upload gagal: respons tidak berisi URL gambar");
    }
    return data.url;
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar (JPG, PNG, WebP, dll)");
      setUploadInputKey(prev => prev + 1);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB");
      setUploadInputKey(prev => prev + 1);
      return;
    }

    setUploadingImage(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setUploadError("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mengupload gambar";
      setUploadError(errorMessage);
      console.error("Upload failed:", error);
    }
    setUploadingImage(false);
    
    // Reset input so same file can be selected again
    setUploadInputKey(prev => prev + 1);
  }

  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    projectType: "RUMAH",
    description: "",
    location: "",
    image: "",
    isFeatured: false,
  });

  function openAddModal() {
    setEditingPortfolio(null);
    setFormData({
      title: "",
      projectType: "RUMAH",
      description: "",
      location: "",
      image: "",
      isFeatured: false,
    });
    setUploadError("");
    setSubmitError("");
    setIsModalOpen(true);
  }

  function openEditModal(portfolio: Portfolio) {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      projectType: portfolio.projectType,
      description: portfolio.description || "",
      location: portfolio.location || "",
      image: portfolio.image || "",
      isFeatured: portfolio.isFeatured,
    });
    setUploadError("");
    setSubmitError("");
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    // Validasi required fields
    if (!formData.title.trim()) {
      setSubmitError("Judul proyek harus diisi");
      return;
    }
    if (!formData.projectType) {
      setSubmitError("Tipe proyek harus dipilih");
      return;
    }
    if (!formData.description.trim()) {
      setSubmitError("Deskripsi proyek harus diisi");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      projectType: formData.projectType,
      description: formData.description.trim(),
      location: formData.location.trim() || null,
      image: formData.image || null,
      isFeatured: formData.isFeatured,
    };

    try {
      const url = editingPortfolio ? `/api/portfolio/${editingPortfolio.id}` : "/api/portfolio";
      const method = editingPortfolio ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          if (text && text.length < 500) {
            errorMessage = text;
          }
        }
        setSubmitError(errorMessage);
        console.error("Submit failed:", { status: response.status, error: errorMessage });
        return;
      }

      const data = await response.json();
      console.log("Submit success:", data);
      setIsModalOpen(false);
      setSubmitError("");
      load();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSubmitError(`Error: ${errorMessage}`);
      console.error("Submit exception:", error);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus portofolio ini?")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    await fetch(`/api/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !currentStatus }),
    });
    load();
  }

  return (
    <section>
      <AdminHeader title="Manajemen Portofolio" subtitle="Kelola data portofolio proyek" />
      <div className="mb-6 flex justify-end">
        <button
          onClick={openAddModal}
          className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition-all hover:bg-green-800"
        >
          <Plus className="mr-2 inline h-4 w-4" />
          Tambah Portofolio
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-brand-dark">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-t transition hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{item.title}</td>
                  <td className="px-4 py-3">{item.projectType}</td>
                  <td className="px-4 py-3">{item.location || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isFeatured
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isFeatured ? "Featured" : "Normal"}
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
                        onClick={() => toggleFeatured(item.id, item.isFeatured)}
                        className="rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {item.isFeatured ? "Unfeature" : "Feature"}
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
        title={editingPortfolio ? "Edit Portofolio" : "Tambah Portofolio"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Judul Proyek</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe Proyek</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="RUMAH">Rumah</option>
                <option value="KAFE">Kafe</option>
                <option value="SEKOLAH">Sekolah</option>
                <option value="KANTOR">Kantor</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="contoh: Duri - Bengkalis, Riau"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Featured</label>
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  Tampilkan di halaman utama
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi Proyek</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Proyek</label>
            <div className="space-y-3">
              {formData.image ? (
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Portfolio preview"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: "" });
                      setUploadError("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <label className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-primary transition-colors">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Klik untuk upload</span> atau drag gambar ke sini
                      </div>
                      <p className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</p>
                    </div>
                    <input
                      key={uploadInputKey}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              {uploadingImage && (
                <p className="text-sm text-blue-600 font-medium">Mengupload gambar...</p>
              )}
              {uploadError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-600 font-semibold text-sm">⚠️</span>
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}
              {formData.image && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image: "" });
                    setUploadError("");
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Ganti gambar
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={uploadingImage}
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploadingImage || !formData.title.trim() || !formData.description.trim()}
              className="rounded-full bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? "Mengupload..." : (editingPortfolio ? "Simpan Perubahan" : "Tambah Portofolio")}
            </button>
          </div>

          {submitError && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
              <span className="text-red-600 font-semibold text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-red-700">Gagal Menyimpan</p>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </section>
  );
}
