import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, ShieldCheck, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/60 bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Ruang Naskah Drama
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Perpustakaan digital dan repositori naskah drama Indonesia untuk pembelajaran, siswa, mahasiswa, guru, dan komunitas teater di seluruh Nusantara.
            </p>
            <p className="text-xs font-semibold text-primary">
              Prinsip: Cari → Baca → Kirim
            </p>
          </div>

          {/* Kategori Populer */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Kategori Naskah
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/naskah?category=naskah-drama-remaja" className="hover:text-primary transition-colors">
                  Naskah Drama Remaja
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-monolog" className="hover:text-primary transition-colors">
                  Naskah Monolog
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-teater" className="hover:text-primary transition-colors">
                  Naskah Teater Panggung
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-bahasa-jawa" className="hover:text-primary transition-colors">
                  Naskah Bahasa Jawa
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-islami" className="hover:text-primary transition-colors">
                  Naskah Islami & Religi
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-bahasa-inggris" className="hover:text-primary transition-colors">
                  Naskah Bahasa Inggris
                </Link>
              </li>
              <li>
                <Link to="/naskah?category=naskah-film" className="hover:text-primary transition-colors">
                  Naskah Film & Sinematografi
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigasi & Partisipasi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Eksplorasi & Kirim
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/naskah" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Jelajahi Semua Naskah
                </Link>
              </li>
              <li>
                <Link to="/kirim-naskah" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-primary" />
                  Kirim Naskah Baru (Tanpa Login)
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-primary transition-colors">
                  Tentang Ruang Naskah Drama
                </Link>
              </li>
              <li>
                <Link to="/kebijakan-hak-cipta" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Kebijakan Hak Cipta & DMCA
                </Link>
              </li>
              <li>
                <Link to="/hubungi-admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Hubungi Admin & Lapor Naskah
                </Link>
              </li>
            </ul>
          </div>

          {/* Catatan Legal & Kurasi */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Pernyataan & Kurasi
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seluruh naskah yang dikirim oleh publik ditinjau secara teliti oleh admin sebelum dipublikasikan. Kami menghargai hak cipta penulis karya teater dan sastra Indonesia.
            </p>
            <div className="pt-2">
              <Link
                to="/hubungi-admin"
                className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <span>Ada pelanggaran hak cipta? Laporkan</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} Ruang Naskah Drama. Repositori Naskah Indonesia Terbuka.</p>
          <div className="flex items-center gap-4">
            <Link to="/kebijakan-hak-cipta" className="hover:text-foreground">Hak Cipta</Link>
            <Link to="/tentang" className="hover:text-foreground">Tentang</Link>
            <Link to="/hubungi-admin" className="hover:text-foreground">Hubungi</Link>
            <Link to="/admin/login" className="hover:text-foreground">Panel Kurator</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
