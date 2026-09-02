import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { DashboardStats } from "../../types";
import {
  BookOpen,
  Send,
  FileCheck2,
  FileEdit,
  Users,
  Eye,
  Download,
  Trash2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 font-medium">Memuat metrik dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, topViewed, topDownloaded, recentSubmissions, recentAuditLogs } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Kurator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan status naskah, statistik keterbacaan, dan antrean review pengiriman publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/naskah/tambah"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tambah Naskah Baru</span>
          </Link>
        </div>
      </div>

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Scripts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Naskah</span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalScripts}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">{stats.publishedScripts} Terbit</span>
            <span>•</span>
            <span>{stats.draftScripts} Draft</span>
          </div>
        </div>

        {/* Pending Submissions */}
        <Link
          to="/admin/submissions"
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Menunggu Review</span>
            <Send className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {stats.pendingSubmissions}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            {stats.pendingSubmissions > 0 ? "Perlu ditinjau segera →" : "Semua bersih"}
          </p>
        </Link>

        {/* Total Views */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pembacaan</span>
            <Eye className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {stats.totalViews.toLocaleString()}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">Akumulasi views naskah</p>
        </div>

        {/* Total Downloads */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Unduhan</span>
            <Download className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.totalDownloads.toLocaleString()}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">Berkas PDF/DOCX diunduh</p>
        </div>
      </div>

      {/* 2. Pending Submissions Alert & Quick Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Antrean Pengiriman Naskah Publik (Pending Review)
            </h2>
          </div>
          <Link
            to="/admin/submissions"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Semua Kiriman</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Judul Naskah</th>
                  <th className="py-2.5 px-3">Penulis</th>
                  <th className="py-2.5 px-3">Pengirim / Kontributor</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {sub.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {sub.author}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <div>{sub.contributor_name}</div>
                      <div className="text-[10px] text-slate-400">{sub.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[10px] font-medium">
                        {sub.category_name || "Kategori"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/submissions/${sub.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 text-xs font-semibold hover:bg-amber-100 transition-colors"
                      >
                        <span>Tinjau & Setujui</span>
                        <span>→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            Tidak ada pengiriman naskah yang menunggu review saat ini.
          </div>
        )}
      </div>

      {/* 3. Top Viewed & Downloaded Two-Column Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Naskah Paling Banyak Dibaca
            </h2>
          </div>
          <div className="space-y-2">
            {topViewed.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 w-4">#{idx + 1}</span>
                  <div>
                    <Link to={`/admin/naskah/edit/${s.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                      {s.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">Oleh {s.author}</p>
                  </div>
                </div>
                <span className="font-bold text-indigo-600 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {s.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Downloaded */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Naskah Paling Banyak Diunduh
            </h2>
          </div>
          <div className="space-y-2">
            {topDownloaded.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 w-4">#{idx + 1}</span>
                  <div>
                    <Link to={`/admin/naskah/edit/${s.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                      {s.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">Oleh {s.author}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  {s.downloads}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Audit Logs */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Aktivitas Kurasi & Audit Terbaru
            </h2>
          </div>
          <Link to="/admin/audit" className="text-xs font-semibold text-blue-600 hover:underline">
            Lihat Semua Log →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {recentAuditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {log.action}
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Oleh <span className="font-semibold">{log.user_name || "Admin"}</span> ({log.entity_type})
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {log.created_at}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

