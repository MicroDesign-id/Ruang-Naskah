import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { Submission, Category } from "../../types";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  Send,
  AlertCircle,
  Users,
  Clock,
  Globe,
  Sparkles,
  ShieldCheck,
  Edit
} from "lucide-react";

export const SubmissionReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Editable fields before publishing (FR-013, FR-014)
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [subData, cats] = await Promise.all([
        api.getAdminSubmissionById(id),
        api.getAdminCategories(),
      ]);
      setSubmission(subData);
      setCategories(cats);

      setTitle(subData.title);
      setAuthor(subData.author);
      setCategoryId(subData.category_id);
      setSynopsis(subData.synopsis);
      setContent(subData.content || "");
      setAdminNote(subData.admin_note || "");
    } catch (err: any) {
      setError(err.message || "Gagal memuat kiriman naskah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleApprove = async (publishStatus: "Terbit" | "Draft") => {
    if (!id) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await api.approveSubmission(id, {
        publish_status: publishStatus,
        admin_note: adminNote,
        title,
        author,
        category_id: categoryId,
        synopsis,
        content,
      });
      setFeedback(res.message);
      setTimeout(() => {
        navigate("/admin/naskah");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menyetujui pengiriman.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await api.rejectSubmission(id, rejectReason || "Naskah belum memenuhi kriteria penerbitan.");
      setFeedback(res.message);
      setRejectModalOpen(false);
      setTimeout(() => {
        navigate("/admin/submissions");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Gagal menolak pengiriman.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 font-medium">Memuat detail kiriman naskah...</p>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/submissions"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Review: {submission.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  submission.status === "Pending"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : submission.status === "Disetujui"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {submission.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dikirim oleh {submission.contributor_name} ({submission.email}) pada {submission.created_at}
            </p>
          </div>
        </div>

        {/* Top Action Buttons (if Pending) */}
        {submission.status === "Pending" && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setRejectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              Tolak
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleApprove("Draft")}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Setujui sebagai Draft
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleApprove("Terbit")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
            >
              Setujui & Terbitkan
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Metadata for Publishing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b">
              Penyesuaian Metadata Sebelum Penerbitan
            </h2>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Naskah
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 font-semibold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Penulis
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sinopsis
              </label>
              <textarea
                rows={4}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 leading-relaxed focus:outline-none"
              />
            </div>

            {submission.cast_list && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Daftar Tokoh (Catatan Kiriman)
                </label>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                  {submission.cast_list}
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Isi Teks Naskah (Online Reader)
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="[BABAK I]..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs leading-relaxed focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Contributor Details & File Inspector */}
        <div className="space-y-6">
          {/* Contributor Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b">
              Data Kontributor
            </h2>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">PENGIRIM</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submission.contributor_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EMAIL</span>
                <span className="font-mono">{submission.email}</span>
              </div>
              {submission.institution && (
                <div>
                  <span className="text-slate-400 block text-[10px]">INSTANSI / KOMUNITAS</span>
                  <span>{submission.institution}</span>
                </div>
              )}
              <div className="pt-2 border-t flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                <ShieldCheck className="h-4 w-4" />
                <span>Pernyataan Hak Cipta Disetujui</span>
              </div>
            </div>
          </div>

          {/* Uploaded File Inspector Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b">
              Berkas Lampiran
            </h2>

            {submission.file_url ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border">
                  <FileText className="h-8 w-8 text-blue-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{submission.title}.pdf</p>
                    <p className="text-[10px] text-slate-400">{submission.file_url}</p>
                  </div>
                </div>

                <a
                  href={submission.file_url}
                  download
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh & Periksa Berkas</span>
                </a>
              </div>
            ) : (
              <p className="text-slate-400 italic py-4 text-center">
                Pengirim tidak melampirkan berkas dokumen fisik (hanya teks langsung).
              </p>
            )}
          </div>

          {/* Admin Note Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b">
              Catatan Admin
            </h2>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Tambahkan catatan internal atau alasan penerbitan/penolakan..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-rose-600">
              <XCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tolak Pengiriman Naskah</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Silakan tuliskan alasan penolakan naskah ini (misal: format tidak lengkap, berkas rusak, atau tidak sesuai kriteria):
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Berkas naskah tidak lengkap atau melanggar hak cipta..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                {actionLoading ? "Menolak..." : "Ya, Tolak Pengiriman"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

