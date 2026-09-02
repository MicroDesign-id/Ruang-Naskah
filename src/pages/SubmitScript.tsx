import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Category } from "../types";
import {
  Send,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Theater,
  HelpCircle,
  X,
  FileCheck
} from "lucide-react";

export const SubmitScript: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCats();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFileError(null);
    if (!selected) {
      setFile(null);
      return;
    }

    // Limit 10MB (BR-004)
    if (selected.size > 10 * 1024 * 1024) {
      setFileError("Ukuran file melebihi batas maksimal 10 MB.");
      setFile(null);
      return;
    }

    // MIME / Extension check (BR-005, BR-006)
    const validExts = [".pdf", ".docx", ".doc"];
    const ext = selected.name.substring(selected.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      setFileError("Format file harus berupa dokumen PDF atau DOCX.");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string)?.trim();
    const contributorName = (formData.get("contributor_name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const author = (formData.get("author") as string)?.trim();
    const categoryId = formData.get("category_id") as string;
    const synopsis = (formData.get("synopsis") as string)?.trim();
    const copyrightAgreed = formData.get("copyright_agreed");

    if (!contributorName || !email || !title || !author || !categoryId || !synopsis) {
      setError("Mohon lengkapi semua field bertanda bintang (*) yang wajib diisi.");
      return;
    }

    if (!copyrightAgreed) {
      setError("Anda wajib menyetujui pernyataan hak publikasi dan keaslian naskah.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitScript(formData);
      setSuccessData({ id: res.submission_id, title });
      form.reset();
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Gagal mengirimkan naskah. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-lg space-y-6">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Naskah Berhasil Dikirimkan!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Terima kasih telah berkontribusi mengirimkan naskah drama <span className="font-semibold text-slate-900 dark:text-white">"{successData.title}"</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span>Nomor Referensi Pengiriman:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{successData.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Status Awal:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                Menunggu Review Admin (Pending)
              </span>
            </div>
            <p className="text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-700 leading-relaxed">
              Tim kurator Ruang Naskah Drama akan memeriksa berkas dan kelayakan naskah sebelum menerbitkannya ke katalog publik. Anda akan menerima pembaruan melalui email jika diperlukan.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setSuccessData(null)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kirim Naskah Lainnya
            </button>
            <Link
              to="/naskah"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Jelajahi Repositori Naskah
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <Send className="h-3.5 w-3.5" />
          <span>Pengiriman Naskah Terbuka</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Formulir Kirim Naskah Drama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Bagikan karya naskah drama Anda kepada siswa, guru, dan komunitas teater di seluruh Indonesia. Anda tidak perlu mendaftar akun untuk mengirimkan naskah.
        </p>
      </div>

      {/* Notice box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Alur Penerbitan Naskah (Cari → Baca → Kirim)</p>
          <p className="leading-relaxed opacity-90">
            Naskah yang Anda kirimkan akan berstatus <span className="font-semibold">Pending</span> dan ditinjau terlebih dahulu oleh tim admin kami untuk memastikan kesesuaian kategori dan hak publikasi sebelum terbit di perpustakaan digital.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section 1: Informasi Pengirim */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Informasi Pengirim
            </h2>
            <p className="text-xs text-slate-400">Identitas pengirim untuk keperluan verifikasi dan arsip kurator.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Pengirim <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contributor_name"
                required
                placeholder="Contoh: Rian Pratama, S.Pd"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="email.anda@contoh.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Instansi / Sekolah / Komunitas Teater <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                name="institution"
                placeholder="Contoh: SMAN 1 Yogyakarta / Komunitas Teater Semesta"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Metadata Naskah */}
        <div className="space-y-4 pt-2">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Metadata & Informasi Naskah
            </h2>
            <p className="text-xs text-slate-400">Metadata terstruktur memudahkan pembaca menemukan naskah Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Naskah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Contoh: Sang Pahlawan di Balik Layar"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Penulis / Pengarang Asli <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                placeholder="Contoh: Rendra Pratama"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Naskah <span className="text-rose-500">*</span>
              </label>
              <select
                name="category_id"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>Pilih Kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bahasa
              </label>
              <select
                name="language"
                defaultValue="Bahasa Indonesia"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Bahasa Jawa">Bahasa Jawa</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Bahasa Sunda">Bahasa Sunda</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Genre
              </label>
              <input
                type="text"
                name="genre"
                placeholder="Contoh: Drama Komedi, Tragedi, Religi"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Pertunjukan
              </label>
              <select
                name="performance_type"
                defaultValue="Teater Panggung"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="Teater Panggung">Teater Panggung</option>
                <option value="Monolog">Monolog</option>
                <option value="Skenario Film Pendek">Skenario Film Pendek</option>
                <option value="Drama Radio / Audio">Drama Radio / Audio</option>
                <option value="Pembacaan Naskah (Dramatic Reading)">Pembacaan Naskah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estimasi Durasi
              </label>
              <input
                type="text"
                name="duration"
                placeholder="Contoh: 30 Menit / 45 Menit"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Pemain / Tokoh <span className="text-slate-400 font-normal">(Angka)</span>
              </label>
              <input
                type="number"
                name="cast_count"
                min="1"
                placeholder="Contoh: 5 (atau 1 untuk monolog)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kelompok Usia Sasaran
              </label>
              <select
                name="age_group"
                defaultValue="Remaja (SMP/SMA)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="Remaja (SMP/SMA)">Remaja (SMP/SMA)</option>
                <option value="Umum">Umum</option>
                <option value="Dewasa">Dewasa</option>
                <option value="Anak-anak (SD)">Anak-anak (SD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tag / Kata Kunci <span className="text-slate-400 font-normal">(Pisahkan dengan koma)</span>
              </label>
              <input
                type="text"
                name="tags"
                placeholder="Persahabatan, FLS2N, Pendidikan, Komedi"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sinopsis Naskah <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="synopsis"
                rows={3}
                required
                placeholder="Tuliskan ringkasan alur cerita naskah secara singkat dan menarik..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daftar Tokoh & Karakter <span className="text-slate-400 font-normal">(Nama dan deskripsi peran singkat)</span>
              </label>
              <textarea
                name="cast_list"
                rows={3}
                placeholder="Contoh:
1. ANDI (17 th) - Ketua kelas yang perfeksionis
2. BAYU (17 th) - Sahabat setia yang ceria"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none leading-relaxed font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Berkas & Teks Naskah */}
        <div className="space-y-4 pt-2">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Berkas Dokumen & Teks Naskah
            </h2>
            <p className="text-xs text-slate-400">Unggah berkas naskah PDF atau DOCX (maksimal 10 MB).</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Unggah Dokumen Naskah (PDF atau DOCX)
            </label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              <input
                type="file"
                name="file"
                id="file-upload"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                {file ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                    <FileCheck className="h-8 w-8" />
                    <div className="text-left">
                      <p className="text-slate-800 dark:text-slate-200">{file.name}</p>
                      <p className="text-slate-400 text-[10px]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Klik atau seret file PDF / DOCX ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Ukuran berkas maksimal 10 MB.</p>
                  </>
                )}
              </div>
            </div>
            {fileError && <p className="mt-1.5 text-xs text-rose-600 font-medium">{fileError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Isi Teks Naskah <span className="text-slate-400 font-normal">(Opsional - jika ingin teks tampil langsung pada pembaca online)</span>
            </label>
            <textarea
              name="content"
              rows={6}
              placeholder="[BABAK I]
ANDI: Kita tidak boleh menyerah sekarang!
BAYU: (Tersenyum) Selalu ada jalan untuk kita..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Section 4: Pernyataan Hak Cipta & Persetujuan */}
        <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="copyright_agreed"
              name="copyright_agreed"
              value="true"
              required
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="copyright_agreed" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white">Pernyataan Hak Cipta & Izin Publikasi: </span>
              Saya menyatakan dan menjamin bahwa saya adalah pemilik hak cipta atas naskah ini atau telah memiliki izin resmi dari pencipta naskah untuk membagikannya di perpustakaan digital Ruang Naskah Drama untuk kepentingan edukasi, pembelajaran, dan pementasan non-komersial.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            to="/naskah"
            className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                <span>Mengirimkan Naskah...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Kirim Naskah untuk Ditinjau Admin</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

