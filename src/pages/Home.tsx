import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { ScriptCard } from "../components/ScriptCard";
import { api } from "../services/api";
import { Category, Script } from "../types";
import {
  Theater,
  BookOpen,
  Search,
  Send,
  Sparkles,
  ArrowRight,
  Globe,
  Scroll,
  Film,
  Moon,
  Mic,
  ShieldCheck,
  TrendingUp,
  Clock
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, { icon: React.ReactNode }> = {
  "naskah-bahasa-inggris": { icon: <Globe className="h-6 w-6 text-primary" /> },
  "naskah-bahasa-jawa": { icon: <Scroll className="h-6 w-6 text-primary" /> },
  "naskah-drama-remaja": { icon: <Sparkles className="h-6 w-6 text-primary" /> },
  "naskah-film": { icon: <Film className="h-6 w-6 text-primary" /> },
  "naskah-islami": { icon: <Moon className="h-6 w-6 text-primary" /> },
  "naskah-monolog": { icon: <Mic className="h-6 w-6 text-primary" /> },
  "naskah-teater": { icon: <Theater className="h-6 w-6 text-primary" /> },
};

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<{ recent: Script[]; popular: Script[] }>({ recent: [], popular: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, featRes] = await Promise.all([
          api.getCategories(),
          api.getFeatured(),
        ]);
        setCategories(catsRes);
        setFeatured(featRes);
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs mb-6">
            <Theater className="h-3.5 w-3.5" />
            <span>Perpustakaan Digital Naskah Drama</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Temukan Naskah Drama <br className="hidden sm:inline" />
            untuk <span className="text-primary">Pembelajaran</span> dan <span className="text-primary">Pementasan</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-lg text-muted-foreground leading-relaxed font-normal">
            Koleksi naskah drama Indonesia yang terorganisir untuk guru, siswa, komunitas teater, dan siapa saja yang ingin membaca atau mementaskan drama.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar size="large" />
          </div>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/naskah"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all hover:scale-102"
            >
              <BookOpen className="h-4 w-4" />
              <span>Jelajahi Naskah</span>
            </Link>

            <Link
              to="/kirim-naskah"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all"
            >
              <Send className="h-4 w-4 text-primary" />
              <span>Kirim Naskah</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Cari -> Baca -> Kirim 3 Steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Cari → Baca → Kirim
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Tiga langkah sederhana untuk menikmati koleksi naskah kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-shadow text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">Cari</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Temukan naskah berdasarkan kategori, bahasa, genre, atau kata kunci apapun.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-shadow text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">Baca</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Baca naskah langsung di browser atau unduh PDF untuk dibaca offline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-shadow text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">Kirim</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Punya naskah? Kirimkan untuk ditinjau admin dan dipublikasikan.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Kategori Naskah */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Kategori Terstruktur
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Jelajahi Berdasarkan Kategori
            </h2>
          </div>
          <Link
            to="/naskah"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Semua Kategori</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const conf = CATEGORY_ICON_MAP[cat.slug] || {
              icon: <Theater className="h-6 w-6 text-primary" />,
            };

            return (
              <Link
                key={cat.id}
                to={`/naskah?category=${cat.slug}`}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/30 transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {conf.icon}
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat.description || "Koleksi naskah berkualitas pilihan."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{cat.scriptCount || 0} naskah</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Koleksi Terbaru */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Baru Dipublikasikan
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Koleksi Terbaru
            </h2>
          </div>
          <Link
            to="/naskah?sort=newest"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featured.recent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.recent.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-2xl border border-border">
            Memuat koleksi naskah...
          </div>
        )}
      </section>

      {/* 5. Koleksi Populer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Banyak Dibaca & Diunduh
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Koleksi Populer
            </h2>
          </div>
          <Link
            to="/naskah?sort=popular"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featured.popular.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.popular.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-2xl border border-border">
            Memuat koleksi populer...
          </div>
        )}
      </section>

      {/* 6. Call to Action Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 sm:px-12 text-center text-primary-foreground shadow-lg">
          <div className="relative max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Punya Naskah untuk Dibagikan?
            </h2>

            <p className="text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
              Kirimkan naskah drama Anda dan bantu memperkaya koleksi perpustakaan digital ini untuk komunitas pendidikan Indonesia.
            </p>

            <div className="pt-3">
              <Link
                to="/kirim-naskah"
                className="inline-flex items-center gap-2 rounded-xl bg-background px-6 py-2.5 text-xs font-bold text-foreground shadow-md hover:bg-background/90 transition-colors"
              >
                <Send className="h-4 w-4 text-primary" />
                <span>Kirim Naskah</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
