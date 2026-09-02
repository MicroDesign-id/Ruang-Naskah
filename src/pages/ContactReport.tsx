import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  Mail,
  Flag,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileQuestion,
  HelpCircle,
  Send,
  ArrowLeft
} from "lucide-react";

export const ContactReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const scriptIdParam = searchParams.get("script_id") || "";
  const scriptTitleParam = searchParams.get("script_title") || "";
  const typeParam = searchParams.get("type") || (scriptIdParam ? "copyright" : "feedback");

  const [reportType, setReportType] = useState<string>(typeParam);
  const [reporterName, setReporterName] = useState<string>("");
  const [reporterEmail, setReporterEmail] = useState<string>("");
  const [scriptTitle, setScriptTitle] = useState<string>(scriptTitleParam);
  const [description, setDescription] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reporterName.trim() || !reporterEmail.trim() || !description.trim()) {
      setError("Nama, email, dan deskripsi pesan wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await api.submitReport({
        report_type: reportType as any,
        script_id: scriptIdParam || undefined,
        script_title: scriptTitle || undefined,
        reporter_name: reporterName.trim(),
        reporter_email: reporterEmail.trim(),
        description: description.trim(),
        proof_url: proofUrl.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengirimkan laporan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pesan / Laporan Terkirim</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Terima kasih atas laporan dan masukan Anda. Tim kurator Ruang Naskah Drama akan meninjau pesan ini sesegera mungkin.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/naskah"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Repositori Naskah</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700">
          <Mail className="h-3.5 w-3.5" />
          <span>Layanan Bantuan & Pelaporan Naskah</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hubungi Admin / Laporkan Naskah
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Gunakan formulir ini untuk melaporkan pelanggaran hak cipta, berkas naskah rusak, usulan penambahan kategori, atau pesan umum lainnya.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Report Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Jenis Pesan / Laporan <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { type: "copyright", label: "Pelanggaran Hak Cipta", icon: Flag },
              { type: "broken_file", label: "File Naskah Rusak / Tidak Lengkap", icon: FileQuestion },
              { type: "feedback", label: "Saran & Masukan Platform", icon: MessageSquare },
              { type: "other", label: "Permintaan Naskah / Lainnya", icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = reportType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setReportType(item.type)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reporter info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Anda <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Email Anda <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="email@anda.com"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul Naskah / Tautan yang Dilaporkan <span className="text-slate-400 font-normal">(Jika terkait naskah tertentu)</span>
            </label>
            <input
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              placeholder="Contoh: Di Balik Tirai Kelas Sebelah (atau URL halaman naskah)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {reportType === "copyright" && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tautan Bukti Kepemilikan Hak Cipta <span className="text-slate-400 font-normal">(Link Google Drive / Publikasi / dll.)</span>
              </label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Uraian Pesan / Kronologi Laporan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara detail pesan atau laporan Anda..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                <span>Mengirimkan...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Kirim Pesan / Laporan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

