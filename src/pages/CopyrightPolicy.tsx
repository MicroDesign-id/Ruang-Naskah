import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, AlertCircle, FileText, Mail, Flag, ArrowRight } from "lucide-react";

export const CopyrightPolicy: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
          <span>Panduan Hukum & Kebijakan Hak Cipta</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Kebijakan Hak Cipta & Prosedur Takedown
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ruang Naskah Drama berkomitmen menghormati hak cipta dan kekayaan intelektual para penulis naskah dan seniman Indonesia.
        </p>
      </div>

      {/* Policy Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Prinsip Kepemilikan Hak Cipta</h2>
          <p>
            Semua hak cipta atas naskah drama yang dipublikasikan di platform ini tetap menjadi milik sah dari penulis, pengarang, atau pemegang hak cipta naskah bersangkutan. Ruang Naskah Drama bertindak sebagai wadah perpustakaan digital / repositori non-komersial untuk mempermudah akses edukasi dan apresiasi teater.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Kewajiban & Pernyataan Pengirim Naskah</h2>
          <p>
            Setiap pengguna yang mengirimkan naskah melalui formulir <Link to="/kirim-naskah" className="text-blue-600 font-semibold underline">Kirim Naskah</Link> diwajibkan menyetujui pernyataan bahwa:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
            <li>Pengirim adalah pencipta asli naskah tersebut, atau;</li>
            <li>Pengirim telah memperoleh izin tertulis / persetujuan dari pemegang hak cipta untuk membagikan karyanya di Ruang Naskah Drama;</li>
            <li>Naskah tidak mengandung unsur plagiasi atau pelanggaran hak pihak ketiga.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Pedoman Penggunaan Naskah oleh Pembaca / Komunitas</h2>
          <p>
            Naskah yang diunduh dari Ruang Naskah Drama ditujukan untuk:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
            <li>Pembelajaran sastra dan seni peran di institusi pendidikan (Sekolah / Kampus).</li>
            <li>Latihan dan festival seni pelajar non-komersial (seperti FLS2N, pekan seni sekolah).</li>
            <li>Pembacaan mandiri dan riset naskah teater.</li>
          </ul>
          <p className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 font-medium">
            Untuk pementasan komersial (tiket berbayar) atau adaptasi film komersial, pementas WAJIB menghubungi langsung penulis asli untuk perizinan dan royalti.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Mekanisme Pelaporan & Takedown (DMCA / Hak Cipta)</h2>
          </div>
          <p>
            Jika Anda adalah pemilik hak cipta yang sah dan menemukan karya Anda dipublikasikan di platform ini tanpa izin yang sesuai, Anda dapat mengajukan permohonan penonaktifan/penghapusan (Notice and Take Down) melalui formulir resmi kami.
          </p>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Informasi yang Diperlukan dalam Laporan:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>Nama lengkap dan informasi kontak resmi pelapor (Email / Telepon).</li>
              <li>Judul naskah dan URL halaman naskah terkait di Ruang Naskah Drama.</li>
              <li>Bukti kepemilikan hak cipta (misal: surat hak cipta, publikasi terdahulu, draf asli).</li>
              <li>Pernyataan itikad baik bahwa publikasi tersebut tidak memiliki izin.</li>
            </ol>
            <div className="pt-2">
              <Link
                to="/hubungi-admin?type=copyright"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
              >
                <Flag className="h-3.5 w-3.5" />
                <span>Kirimkan Formulir Laporan Hak Cipta</span>
              </Link>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Tim admin akan meninjau laporan maksimal dalam 2x24 jam kerja dan menonaktifkan status naskah dari publikasi selama proses verifikasi.
          </p>
        </section>
      </div>
    </div>
  );
};

