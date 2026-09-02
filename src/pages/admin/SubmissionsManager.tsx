import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { Submission } from "../../types";
import { Pagination } from "../../components/Pagination";
import {
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  X,
  ArrowRight
} from "lucide-react";

export const SubmissionsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const statusTab = searchParams.get("status") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminSubmissions({
        page: currentPage.toString(),
        limit: "15",
        status: statusTab,
      });
      setSubmissions(res.submissions);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [searchParams]);

  const updateTab = (status: string) => {
    const next = new URLSearchParams(searchParams);
    if (status && status !== "all") {
      next.set("status", status);
    } else {
      next.delete("status");
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Review Pengiriman Naskah Publik
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tinjau naskah yang dikirimkan oleh guru, siswa, dan komunitas teater sebelum dipublikasikan.
        </p>
      </div>

      {/* Tabs */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "Semua Pengiriman" },
            { id: "Pending", label: "Menunggu Review (Pending)" },
            { id: "Disetujui", label: "Disetujui" },
            { id: "Ditolak", label: "Ditolak" },
          ].map((tab) => {
            const active = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? tab.id === "Pending"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
            <p className="mt-2 text-xs text-slate-500 font-medium">Memuat pengiriman...</p>
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Judul & Penulis</th>
                  <th className="py-3.5 px-4">Pengirim / Kontak</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal Kirim</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <Link
                          to={`/admin/submissions/${sub.id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-sm"
                        >
                          {sub.title}
                        </Link>
                        <p className="text-slate-500 text-[11px]">Penulis: {sub.author}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {sub.contributor_name}
                        </span>
                        <span className="text-slate-400 text-[11px] block">{sub.email}</span>
                        {sub.institution && (
                          <span className="text-[10px] text-slate-400 italic">{sub.institution}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[10px] font-semibold">
                        {sub.category_name || "Kategori"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : sub.status === "Disetujui"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {sub.created_at}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/submissions/${sub.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-3 py-1.5 transition-colors"
                      >
                        <span>Tinjau</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Send className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada pengiriman naskah</p>
            <p className="text-xs">Daftar pengiriman naskah akan muncul di sini.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => {
              const next = new URLSearchParams(searchParams);
              next.set("page", p.toString());
              setSearchParams(next);
            }}
          />
        </div>
      </div>
    </div>
  );
};

