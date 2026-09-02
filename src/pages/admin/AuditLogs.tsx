import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { AuditLog } from "../../types";
import { History, Shield, User, Clock, Terminal } from "lucide-react";

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          Log Aktivitas & Riwayat Audit
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Rekaman seluruh operasi penting: login admin, create/update/trash naskah, approval submission, dan download.
        </p>
      </div>

      {/* Logs Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Memuat riwayat audit...</div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Aksi (Action)</th>
                  <th className="py-3.5 px-4">Pengguna / Aktor</th>
                  <th className="py-3.5 px-4">Tipe Entitas</th>
                  <th className="py-3.5 px-4">Detail Metadata</th>
                  <th className="py-3.5 px-4 text-right">Waktu (UTC/WIB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {log.user_name || "Guest / Publik"}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {log.entity_type}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] font-mono text-slate-500 max-w-xs truncate">
                      {log.metadata || "-"}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] text-right">
                      {log.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400">Belum ada log audit tercatat.</div>
        )}
      </div>
    </div>
  );
};

