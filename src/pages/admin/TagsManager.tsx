import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Tag } from "../../types";
import { Tag as TagIcon, PlusCircle, Trash2, X, CheckCircle2 } from "lucide-react";

export const TagsManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTags();
      setTags(data);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal memuat tags." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setSaving(true);
    try {
      const res = await api.saveAdminTag({ name: newTagName.trim() });
      setFeedback({ type: "success", message: res.message });
      setNewTagName("");
      loadTags();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t: Tag) => {
    if (!window.confirm(`Hapus tag "#${t.name}"?`)) return;
    try {
      const res = await api.deleteAdminTag(t.id);
      setFeedback({ type: "success", message: res.message });
      loadTags();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <TagIcon className="h-6 w-6 text-blue-600" />
          Manajemen Tag Koleksi Naskah
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola kata kunci dan tag untuk mempermudah pencarian tematik.
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

      {/* Add Tag Form */}
      <form
        onSubmit={handleAddTag}
        className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3"
      >
        <input
          type="text"
          required
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Ketik nama tag baru (contoh: Pendidikan Karakter, Monolog Festival)..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Tag</span>
        </button>
      </form>

      {/* Tags List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Memuat tags...</div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {tags.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 transition-all"
              >
                <span>#{t.name}</span>
                {t.scriptCount !== undefined && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({t.scriptCount})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(t)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Hapus Tag"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

