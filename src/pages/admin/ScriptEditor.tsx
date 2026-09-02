import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { Category, Tag } from "../../types";
import {
  Save,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  ImageIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Theater,
  HelpCircle
} from "lucide-react";

export const ScriptEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [language, setLanguage] = useState("Bahasa Indonesia");
  const [genre, setGenre] = useState("");
  const [performanceType, setPerformanceType] = useState("Teater Panggung");
  const [duration, setDuration] = useState("");
  const [castCount, setCastCount] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState("Remaja (SMP/SMA)");
  const [synopsis, setSynopsis] = useState("");
  const [castList, setCastList] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [status, setStatus] = useState<"Draft" | "Terbit">("Draft");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug when title changes (if adding new script)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          api.getAdminCategories(),
          api.getAdminTags(),
        ]);
        setCategories(cats);
        setAllTags(tags);

        if (isEditing && id) {
          const script = await api.getAdminScriptById(id);
          setTitle(script.title);
          setSlug(script.slug);
          setAuthor(script.author);
          setCategoryId(script.category_id);
          setLanguage(script.language);
          setGenre(script.genre || "");
          setPerformanceType(script.performance_type || "Teater Panggung");
          setDuration(script.duration || "");
          setCastCount(script.cast_count !== null && script.cast_count !== undefined ? script.cast_count.toString() : "");
          setAgeGroup(script.age_group || "Remaja (SMP/SMA)");
          setSynopsis(script.synopsis);
          setCastList(typeof script.cast_list === "string" ? script.cast_list : JSON.stringify(script.cast_list, null, 2));
          setContent(script.content || "");
          setCoverUrl(script.cover_url || "");
          setFileUrl(script.file_url || "");
          setStatus(script.status === "Terbit" ? "Terbit" : "Draft");
          setSelectedTagIds(script.tags || []);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data naskah.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEditing]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (publishStatus?: "Draft" | "Terbit") => {
    setError(null);
    setSuccessMsg(null);

    if (!title.trim() || !author.trim() || !categoryId || !synopsis.trim()) {
      setError("Judul, Penulis, Kategori, dan Sinopsis wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      let finalCoverUrl = coverUrl;
      let finalFileUrl = fileUrl;

      // Upload Cover if new file selected
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("cover", coverFile);
        const coverRes = await api.uploadCover(coverFormData);
        finalCoverUrl = coverRes.url;
      }

      // Upload Document if new file selected
      if (docFile) {
        const docFormData = new FormData();
        docFormData.append("file", docFile);
        const docRes = await api.uploadDocument(docFormData);
        finalFileUrl = docRes.url;
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        author: author.trim(),
        category_id: categoryId,
        language,
        genre: genre.trim() || null,
        performance_type: performanceType || null,
        duration: duration.trim() || null,
        cast_count: castCount ? parseInt(castCount, 10) : null,
        age_group: ageGroup || null,
        synopsis: synopsis.trim(),
        cast_list: castList.trim() || null,
        content: content.trim() || null,
        cover_url: finalCoverUrl || null,
        file_url: finalFileUrl || null,
        status: publishStatus || status,
        tags: selectedTagIds,
      };

      if (isEditing && id) {
        const res = await api.updateAdminScript(id, payload);
        setSuccessMsg("Naskah berhasil diperbarui!");
        setTimeout(() => navigate("/admin/naskah"), 1200);
      } else {
        const res = await api.createAdminScript(payload);
        setSuccessMsg("Naskah berhasil dibuat dan disimpan!");
        setTimeout(() => navigate("/admin/naskah"), 1200);
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan naskah.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 font-medium">Memuat editor naskah...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/naskah"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? `Edit Naskah: ${title || "Tanpa Judul"}` : "Tambah Naskah Baru"}
            </h1>
            <p className="text-xs text-slate-500">
              Isi metadata komprehensif, upload berkas, dan atur status penerbitan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Draft")}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Terbit")}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Simpan & Terbitkan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Metadata & Script Body */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100">
              Informasi Utama
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Naskah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Sang Pahlawan di Balik Layar"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug <span className="text-slate-400 font-normal">(Otomatis/Kustom)</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sang-pahlawan-di-balik-layar"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penulis / Pengarang <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama penulis"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Pilih Kategori...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sinopsis Cerita <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Ringkasan alur cerita naskah..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs leading-relaxed focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Daftar Tokoh & Karakter
                </label>
                <textarea
                  rows={4}
                  value={castList}
                  onChange={(e) => setCastList(e.target.value)}
                  placeholder="1. ANDI (17 th) - Ketua kelas
2. BAYU (17 th) - Sahabat setia"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono leading-relaxed focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Script Content Editor */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Isi Teks Naskah Digital
              </h2>
              <span className="text-[11px] text-slate-400">Mode Pembaca Online</span>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">
                Format standar teater: Gunakan <span className="font-mono font-bold">[BABAK I]</span> untuk judul adegan, <span className="font-mono font-bold">NAMA TOKOH</span> untuk dialog, dan <span className="font-mono font-bold">(keterangan panggung)</span> untuk stage directions.
              </p>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="[BABAK 1]
LATAR: RUANG KELAS DI SORE HARI...

ANDI
(Menundukkan kepala)
Kita tidak boleh menyerah sekarang..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-xs font-mono leading-relaxed focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Attributes, Uploads & Tags */}
        <div className="space-y-6">
          {/* Attributes Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100">
              Atribut & Filter
            </h2>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bahasa</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              >
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Bahasa Jawa">Bahasa Jawa</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Bahasa Sunda">Bahasa Sunda</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Drama, Komedi, Tragedi..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Pertunjukan</label>
              <select
                value={performanceType}
                onChange={(e) => setPerformanceType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              >
                <option value="Teater Panggung">Teater Panggung</option>
                <option value="Monolog">Monolog</option>
                <option value="Skenario Film Pendek">Skenario Film Pendek</option>
                <option value="Drama Radio / Audio">Drama Radio / Audio</option>
                <option value="Pembacaan Naskah (Dramatic Reading)">Pembacaan Naskah</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Tokoh / Pemain</label>
              <input
                type="number"
                min="1"
                value={castCount}
                onChange={(e) => setCastCount(e.target.value)}
                placeholder="Contoh: 5"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Durasi</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Contoh: 35 Menit"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelompok Usia</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 focus:outline-none"
              >
                <option value="Remaja (SMP/SMA)">Remaja (SMP/SMA)</option>
                <option value="Umum">Umum</option>
                <option value="Dewasa">Dewasa</option>
                <option value="Anak-anak (SD)">Anak-anak (SD)</option>
              </select>
            </div>
          </div>

          {/* Document File & Cover Upload Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100">
              Dokumen & Sampul
            </h2>

            {/* Document upload */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Berkas Naskah (PDF/DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileUrl && !docFile && (
                <p className="mt-1 text-[11px] text-emerald-600 truncate">Berkas saat ini: {fileUrl}</p>
              )}
            </div>

            {/* Cover upload */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gambar Sampul / Cover
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {coverUrl && !coverFile && (
                <p className="mt-1 text-[11px] text-slate-400 truncate">Sampul saat ini: {coverUrl}</p>
              )}
            </div>
          </div>

          {/* Tags Picker Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100">
              Pilih Tag
            </h2>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {allTags.map((t) => {
                const selected = selectedTagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      selected
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

