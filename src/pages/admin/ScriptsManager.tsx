import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { Script, Category } from "../../types";
import { Pagination } from "../../components/Pagination";
import {
  BookOpen,
  PlusCircle,
  Search,
  Eye,
  Download,
  Edit,
  Trash2,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  FileEdit,
  X,
  ShieldAlert
} from "lucide-react";

export const ScriptsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [trashModalScript, setTrashModalScript] = useState<Script | null>(null);
  const [restoreModalScript, setRestoreModalScript] = useState<Script | null>(null);
  const [permanentModalScript, setPermanentModalScript] = useState<Script | null>(null);

  const statusTab = searchParams.get("status") || "all";
  const searchKeyword = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category_id") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const loadCategories = async () => {
    try {
      const data = await api.getAdminCategories();
      setCategories(data);
    } catch (err) {}
  };

  const loadScripts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: "15",
        status: statusTab,
      };
      if (searchKeyword) params.q = searchKeyword;
      if (categoryFilter) params.category_id = categoryFilter;

      const res = await api.getAdminScripts(params);
      setScripts(res.scripts);
      setPagination(res.pagination);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal memuat naskah." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadScripts();
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  // 1. Move to Trash action
  const handleConfirmTrash = async () => {
    if (!trashModalScript) return;
    setActionLoading(true);
    try {
      const res = await api.trashAdminScript(trashModalScript.id);
      setFeedback({ type: "success", message: res.message });
      setTrashModalScript(null);
      loadScripts();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Restore action
  const handleConfirmRestore = async (targetStatus: "Terbit" | "Draft") => {
    if (!restoreModalScript) return;
    setActionLoading(true);
    try {
      const res = await api.restoreAdminScript(restoreModalScript.id, targetStatus);
      setFeedback({ type: "success", message: res.message });
      setRestoreModalScript(null);
      loadScripts();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Permanent Delete action (FR-019, SRS AT-015)
  const handleConfirmPermanentDelete = async () => {
    if (!permanentModalScript) return;
    setActionLoading(true);
    try {
      const res = await api.permanentDeleteAdminScript(permanentModalScript.id);
      setFeedback({ type: "success", message: res.message });
      setPermanentModalScript(null);
      loadScripts();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Koleksi Naskah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola draf, publikasi, pratinjau, dan pemulihan naskah dari sampah (Trash/Restore).
          </p>
        </div>

        <Link
          to="/admin/naskah/tambah"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Naskah Baru</span>
        </Link>
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

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "Semua Naskah" },
            { id: "Terbit", label: "Terbit (Publik)" },
            { id: "Draft", label: "Draft" },
            { id: "Pending", label: "Pending" },
            { id: "Trash", label: "Sampah (Trash)" },
          ].map((tab) => {
            const active = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateParam("status", tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? tab.id === "Trash"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              defaultValue={searchKeyword}
              placeholder="Cari berdasarkan judul atau penulis..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("q", (e.target as HTMLInputElement).value);
                }
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-9 pr-4 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => updateParam("category_id", e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-3 text-xs font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scripts Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
            <p className="mt-2 text-xs text-slate-500 font-medium">Memuat data naskah...</p>
          </div>
        ) : scripts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Judul & Penulis</th>
                  <th className="py-3.5 px-4">Kategori & Bahasa</th>
                  <th className="py-3.5 px-4">Pemain / Durasi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Statistik</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scripts.map((script) => (
                  <tr key={script.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <Link
                          to={`/admin/naskah/edit/${script.id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-sm line-clamp-1"
                        >
                          {script.title}
                        </Link>
                        <p className="text-slate-500 text-[11px] mt-0.5">Penulis: {script.author}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {script.category_name || "Kategori"}
                        </span>
                        <span className="text-[11px] text-slate-400">{script.language}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 dark:text-slate-300">
                        <span>{script.cast_count ? `${script.cast_count} Tokoh` : "-"}</span>
                        <span className="text-slate-400 block text-[11px]">{script.duration || "-"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          script.status === "Terbit"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40"
                            : script.status === "Draft"
                            ? "bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800"
                            : script.status === "Trash"
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {script.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="h-3 w-3 text-blue-500" />
                          {script.views}
                        </span>
                        <span className="flex items-center gap-1" title="Downloads">
                          <Download className="h-3 w-3 text-emerald-500" />
                          {script.downloads}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If in Trash: Show Restore & Permanent Delete */}
                        {script.status === "Trash" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setRestoreModalScript(script)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="Pulihkan Naskah dari Sampah"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPermanentModalScript(script)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                              title="Hapus Permanen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Public Preview */}
                            <Link
                              to={`/naskah/${script.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              title="Lihat Pratinjau Publik"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            {/* Edit */}
                            <Link
                              to={`/admin/naskah/edit/${script.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                              title="Edit Naskah"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            {/* Move to Trash */}
                            <button
                              type="button"
                              onClick={() => setTrashModalScript(script)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Pindahkan ke Sampah"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada naskah ditemukan</p>
            <p className="text-xs">Coba sesuaikan kata kunci pencarian atau tab status di atas.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => updateParam("page", p.toString())}
          />
        </div>
      </div>

      {/* 1. Modal Konfirmasi Pindah ke Sampah */}
      {trashModalScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pindahkan ke Sampah?</h3>
                <p className="text-xs text-slate-400">Naskah tidak akan tampil lagi di publik.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Naskah <span className="font-bold text-slate-900 dark:text-white">"{trashModalScript.title}"</span> akan dipindahkan ke folder Sampah (Trash). Anda dapat memulihkannya kembali kapan saja.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTrashModalScript(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmTrash}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                {actionLoading ? "Memproses..." : "Ya, Pindahkan ke Sampah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Restore dari Sampah */}
      {restoreModalScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pulihkan Naskah?</h3>
                <p className="text-xs text-slate-400">Pilih status penerbitan saat dipulihkan.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pulihkan naskah <span className="font-bold text-slate-900 dark:text-white">"{restoreModalScript.title}"</span> sebagai Draft atau langsung Terbitkan ke publik?
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestoreModalScript(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleConfirmRestore("Draft")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Pulihkan sebagai Draft
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleConfirmRestore("Terbit")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Langsung Terbitkan (Publik)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Konfirmasi Hapus Permanen (BR-009, FR-019, SRS AT-015) */}
      {permanentModalScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-rose-200 dark:border-rose-900">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-700 dark:text-rose-400">Konfirmasi Hapus Permanen</h3>
                <p className="text-xs text-slate-400">Tindakan destruktif ini tidak dapat dibatalkan!</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda benar-benar yakin ingin menghapus naskah <span className="font-bold text-slate-900 dark:text-white">"{permanentModalScript.title}"</span> secara permanen dari basis data? Seluruh riwayat dan data tag naskah ini akan terhapus total.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPermanentModalScript(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batalkan
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

