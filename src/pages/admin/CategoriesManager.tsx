import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Category } from "../../types";
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen
} from "lucide-react";

export const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("BookOpen");
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminCategories();
      setCategories(data);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal memuat kategori." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("Theater");
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcon(cat.icon || "Theater");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await api.saveAdminCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        icon,
      });
      setFeedback({ type: "success", message: res.message });
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal menyimpan kategori." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) return;
    try {
      const res = await api.deleteAdminCategory(cat.id);
      setFeedback({ type: "success", message: res.message });
      loadCategories();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal menghapus kategori." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-blue-600" />
            Manajemen Kategori Naskah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola 7 kategori utama dan sub-kategori repositori naskah drama Indonesia.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
          <p className="mt-2 text-xs text-slate-500 font-medium">Memuat kategori...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {cat.publishedScripts || 0} Terbit
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  /naskah?category={cat.slug}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Total: {cat.totalScripts || 0} Naskah
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                    title="Edit Kategori"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kategori <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Naskah Drama Remaja"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="naskah-drama-remaja"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uraian singkat tentang cakupan kategori ini..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                {saving ? "Menyimpan..." : "Simpan Kategori"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

