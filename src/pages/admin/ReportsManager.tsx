import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Report } from "../../types";
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  MessageSquare,
  ShieldAlert,
  ExternalLink,
  X
} from "lucide-react";

export const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusInput, setStatusInput] = useState("Open");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminReports();
      setReports(data);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal memuat laporan." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const openDetail = (rep: Report) => {
    setSelectedReport(rep);
    setStatusInput(rep.status);
    setAdminNotesInput(rep.admin_notes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const res = await api.updateReportStatus(selectedReport.id, statusInput, adminNotesInput);
      setFeedback({ type: "success", message: res.message });
      setSelectedReport(null);
      loadReports();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setUpdating(false);
    }
  };

  // Direct unpublish script action (FR-028)
  const handleUnpublishScript = async () => {
    if (!selectedReport) return;
    if (!window.confirm("Naskah ini akan langsung dinonaktifkan dari publikasi (status diubah ke Draft) dan laporan diselesaikan. Lanjutkan?")) return;

    setUpdating(true);
    try {
      const res = await api.unpublishReportedScript(selectedReport.id);
      setFeedback({ type: "success", message: res.message });
      setSelectedReport(null);
      loadReports();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Flag className="h-6 w-6 text-rose-600" />
          Laporan Hak Cipta & Pengaduan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tinjau klaim hak cipta, laporan file rusak, dan tindak lanjuti penonaktifan naskah (takedown).
        </p>
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

      {/* Reports Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Memuat laporan...</div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Jenis Laporan</th>
                  <th className="py-3.5 px-4">Naskah Terkait</th>
                  <th className="py-3.5 px-4">Pelapor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full ${
                          rep.report_type === "copyright"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {rep.report_type === "copyright" ? "Hak Cipta" : rep.report_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {rep.linked_script_title || rep.script_title || "-"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold block text-slate-900 dark:text-white">{rep.reporter_name}</span>
                      <span className="text-[11px] text-slate-400">{rep.reporter_email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === "Open"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : rep.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {rep.created_at}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(rep)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
                      >
                        Tinjau Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak Ada Laporan Aktif</p>
            <p className="text-xs">Semua aduan atau laporan hak cipta telah terselesaikan.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleUpdateStatus}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flag className="h-4 w-4 text-rose-600" />
                Detail Laporan Hak Cipta / Aduan
              </h3>
              <button type="button" onClick={() => setSelectedReport(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Pelapor:</span>
                <span className="font-bold">{selectedReport.reporter_name} ({selectedReport.reporter_email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Naskah Terkait:</span>
                <span className="font-bold">{selectedReport.linked_script_title || selectedReport.script_title || "-"}</span>
              </div>
              {selectedReport.proof_url && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Bukti:</span>
                  <a href={selectedReport.proof_url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline truncate max-w-[200px]">
                    {selectedReport.proof_url}
                  </a>
                </div>
              )}
              <div className="pt-2 border-t text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                <span className="font-semibold block text-slate-900 dark:text-white">Uraian Laporan:</span>
                {selectedReport.description}
              </div>
            </div>

            {/* Quick Unpublish Button if linked to a script */}
            {selectedReport.script_id && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-rose-800">Tindakan Takedown Cepat</p>
                  <p className="text-[11px] text-rose-600">Ubah naskah ini ke status Draft & selesaikan laporan.</p>
                </div>
                <button
                  type="button"
                  onClick={handleUnpublishScript}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 shrink-0"
                >
                  Takedown Naskah
                </button>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Penanganan Laporan
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none"
              >
                <option value="Open">Open (Baru Masuk)</option>
                <option value="In Review">In Review (Sedang Diperiksa)</option>
                <option value="Resolved">Resolved (Terselesaikan)</option>
                <option value="Dismissed">Dismissed (Ditolak / Tidak Terbukti)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Penyelesaian Admin
              </label>
              <textarea
                rows={3}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Tuliskan catatan tindak lanjut..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                {updating ? "Menyimpan..." : "Simpan Status Laporan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

