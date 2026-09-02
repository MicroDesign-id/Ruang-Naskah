import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Script } from "../types";
import { ScriptReader } from "../components/ScriptReader";
import { ScriptCard } from "../components/ScriptCard";
import {
  Theater,
  BookOpen,
  Download,
  Share2,
  Eye,
  Users,
  Clock,
  Globe,
  Calendar,
  Sparkles,
  ChevronRight,
  Check,
  Flag,
  Copy,
  ArrowLeft
} from "lucide-react";

export const ScriptDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getScriptBySlug(slug);
        setScript(data);
      } catch (err: any) {
        setError(err.message || "Naskah tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const handleDownload = () => {
    if (!script) return;
    setDownloading(true);
    // Trigger download endpoint which increments downloads counter
    window.location.href = `/api/scripts/${script.id}/download`;
    // Optimistically increment local downloads count
    setScript((prev) => (prev ? { ...prev, downloads: prev.downloads + 1 } : null));
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: script?.title,
          text: `Baca naskah drama "${script?.title}" karya ${script?.author} di Ruang Naskah Drama.`,
          url,
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToReader = () => {
    const el = document.getElementById("script-reader-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent align-[-0.125em]" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Memuat detail naskah...</p>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Theater className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Naskah Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">{error || "Naskah ini mungkin belum dipublikasikan atau sudah dipindahkan."}</p>
        <Link
          to="/naskah"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog Naskah</span>
        </Link>
      </div>
    );
  }

  const catName = script.category?.name || script.category_name || "Naskah";
  const catSlug = script.category?.slug || script.category_slug || "";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600">Beranda</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/naskah" className="hover:text-blue-600">Naskah</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/naskah?category=${catSlug}`} className="hover:text-blue-600">{catName}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{script.title}</span>
      </nav>

      {/* Main Detail Header Card */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cover Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md">
              {script.cover_url && !script.cover_url.startsWith("/placeholder") ? (
                <img src={script.cover_url} alt={script.title} className="w-full h-full object-cover" />
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center mb-3">
                    <Theater className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{catName}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{script.language}</span>
                </div>
              )}
            </div>

            {/* Quick Stats Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">DILIHAT</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                  {script.views}x
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">DIUNDUH</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                  <Download className="h-3.5 w-3.5 text-emerald-500" />
                  {script.downloads}x
                </span>
              </div>
            </div>
          </div>

          {/* Details & Actions Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              {/* Category & Genre Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <Link
                  to={`/naskah?category=${catSlug}`}
                  className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100"
                >
                  {catName}
                </Link>
                {script.genre && (
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {script.genre}
                  </span>
                )}
                {script.performance_type && (
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {script.performance_type}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {script.title}
              </h1>

              {/* Author */}
              <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                Karya Penulis: <span className="text-slate-900 dark:text-white font-bold">{script.author}</span>
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Globe className="h-3 w-3 text-blue-500" />
                  Bahasa
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{script.language}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Users className="h-3 w-3 text-emerald-500" />
                  Jumlah Pemain
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {script.cast_count === 1 ? "1 (Monolog)" : script.cast_count ? `${script.cast_count} Tokoh` : "Tidak ditentukan"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  Durasi
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{script.duration || "± 30 Menit"}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  Kelompok Usia
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{script.age_group || "Umum"}</p>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sinopsis Cerita
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {script.synopsis}
              </p>
            </div>

            {/* Tags */}
            {script.tags && script.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {script.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/naskah?tag=${tag.slug}`}
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-blue-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToReader}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Baca Naskah Lengkap</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4 text-emerald-600" />
                <span>{downloading ? "Mengunduh..." : "Unduh Dokumen Naskah"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                title="Bagikan Tautan Naskah"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-semibold text-xs">Tautan Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-blue-600" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>

              <Link
                to={`/hubungi-admin?script_id=${script.id}&script_title=${encodeURIComponent(script.title)}`}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 ml-auto py-2"
                title="Laporkan naskah jika ada pelanggaran hak cipta"
              >
                <Flag className="h-3 w-3" />
                <span>Laporkan Naskah</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cast & Characters Breakdown Section */}
      {script.cast_list && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Tokoh & Karakter
            </h2>
          </div>

          {Array.isArray(script.cast_list_parsed) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {script.cast_list_parsed.map((cast: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="font-bold text-sm text-blue-700 dark:text-blue-400 block">
                    {cast.name}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {cast.role}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {typeof script.cast_list_parsed === "string" ? script.cast_list_parsed : script.cast_list}
            </div>
          )}
        </section>
      )}

      {/* Interactive Script Reader Section */}
      <section id="script-reader-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Teks Naskah Lengkap
            </h2>
            <p className="text-xs text-slate-500">
              Gunakan kontrol di bawah untuk mengatur ukuran font, tema kontras, atau beralih ke layar penuh.
            </p>
          </div>
        </div>

        <ScriptReader
          title={script.title}
          author={script.author}
          content={script.content || ""}
        />
      </section>

      {/* Related Scripts */}
      {script.related && script.related.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Naskah Terkait di Kategori {catName}
            </h2>
            <Link
              to={`/naskah?category=${catSlug}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Lihat Kategori Ini →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {script.related.map((rel) => (
              <Link
                key={rel.id}
                to={`/naskah/${rel.slug}`}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Oleh: {rel.author}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{rel.views} views</span>
                  <span className="text-blue-600 font-semibold">Baca →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

