import React from "react";
import { Link } from "react-router-dom";
import { Theater, BookOpen, Send, Users, Heart, Sparkles, ShieldCheck } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <Theater className="h-3.5 w-3.5" />
          <span>Tentang Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tentang Ruang Naskah Drama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Membangun repositori digital naskah drama Indonesia yang terbuka, terkurasi, dan mudah diakses untuk mendukung pendidikan seni dan teater.
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latar Belakang & Visi</h2>
          <p>
            Ruang Naskah Drama didirikan untuk menjawab tantangan kelangkaan referensi naskah teater dan drama di lingkungan sekolah, kampus, dan komunitas teater daerah di Indonesia. Selama bertahun-tahun, banyak guru dan siswa kesulitan menemukan naskah drama yang terstruktur dengan rincian jumlah tokoh, durasi, kelompok usia, serta format dialog yang layak pentas.
          </p>
          <p>
            Visi kami adalah menjadi pusat repositori naskah drama Indonesia terlengkap yang menaungi berbagai bahasa (Bahasa Indonesia, Bahasa Jawa, Bahasa Inggris, dll.), beragam format (Teater Panggung, Monolog, Skenario Film Pendek, Drama Audio), dan lintas tema.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Prinsip Produk: Cari → Baca → Kirim</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-blue-600 block text-base">1. Cari</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pencarian berbasis kebutuhan nyata: jumlah pemain, kelompok umur, durasi, hingga bahasa.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-emerald-600 block text-base">2. Baca</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Membaca naskah secara nyaman di browser ponsel maupun laptop, atau unduh dokumen untuk latihan.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-purple-600 block text-base">3. Kirim</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Membuka ruang bagi penulis dan komunitas untuk berbagi karya secara sukarela tanpa birokrasi rumit.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Standar Kurasi & Hak Cipta</h2>
          <p>
            Setiap naskah yang dikirimkan oleh publik melewati proses kurasi admin sebelum diterbitkan. Kami sangat menjunjung tinggi integritas hak cipta dan perlindungan kekayaan intelektual para sastrawan dan penulis naskah Indonesia.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/kebijakan-hak-cipta"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Baca Kebijakan Hak Cipta Lengkap</span>
            </Link>
            <Link
              to="/hubungi-admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
            >
              <span>Hubungi Admin & Kurator</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

