import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Clock, Eye, Download, Globe, Theater, Sparkles } from "lucide-react";
import { Script } from "../types";

interface ScriptCardProps {
  script: Script;
  viewMode?: "grid" | "list";
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "naskah-bahasa-inggris": { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-800 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  "naskah-bahasa-jawa": { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-800 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  "naskah-drama-remaja": { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-800 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  "naskah-film": { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-800 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800" },
  "naskah-islami": { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-800 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800" },
  "naskah-monolog": { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-800 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
  "naskah-teater": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
};

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, viewMode = "grid" }) => {
  const catSlug = script.category?.slug || script.category_slug || "";
  const catName = script.category?.name || script.category_name || "Naskah";
  const catStyle = CATEGORY_COLORS[catSlug] || { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" };

  if (viewMode === "list") {
    return (
      <article className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition-all">
        {/* Cover thumbnail / Fallback */}
        <div className="relative w-full sm:w-36 sm:min-w-[9rem] h-40 sm:h-auto rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/60">
          {script.cover_url && !script.cover_url.startsWith("/placeholder") ? (
            <img src={script.cover_url} alt={script.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="p-3 text-center flex flex-col items-center justify-center">
              <Theater className="h-8 w-8 text-primary/60 mb-1" />
              <span className="text-[10px] font-medium text-muted-foreground line-clamp-1">{catName}</span>
            </div>
          )}
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {catName}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {script.language}
              </span>
              {script.genre && (
                <span className="text-xs text-muted-foreground">• {script.genre}</span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              <Link to={`/naskah/${script.slug}`}>
                {script.title}
              </Link>
            </h3>

            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              Karya: <span className="text-foreground">{script.author}</span>
            </p>

            <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {script.synopsis}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {script.cast_count !== null && script.cast_count !== undefined && (
                <span className="flex items-center gap-1" title="Jumlah Tokoh/Pemain">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {script.cast_count === 1 ? "1 (Monolog)" : `${script.cast_count} Pemain`}
                </span>
              )}
              {script.duration && (
                <span className="flex items-center gap-1" title="Estimasi Durasi">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {script.duration}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1" title="Jumlah Dilihat">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                {script.views}
              </span>
              <span className="flex items-center gap-1" title="Jumlah Diunduh">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                {script.downloads}
              </span>
              <Link
                to={`/naskah/${script.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline ml-2"
              >
                Baca Naskah →
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view mode (Default)
  return (
    <article className="group flex flex-col rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition-all overflow-hidden">
      {/* Cover / Header Card banner */}
      <Link to={`/naskah/${script.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted border-b border-border/60">
        {script.cover_url && !script.cover_url.startsWith("/placeholder") ? (
          <img
            src={script.cover_url}
            alt={script.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/50">
            <div className="h-12 w-12 rounded-2xl bg-card shadow-xs flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <Theater className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-foreground line-clamp-1">{catName}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{script.language}</span>
          </div>
        )}

        {/* Category Pill */}
        <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
          {catName}
        </span>
      </Link>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1 font-medium">
            <Globe className="h-3 w-3" />
            {script.language}
          </span>
          {script.genre && (
            <>
              <span>•</span>
              <span className="truncate">{script.genre}</span>
            </>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
          <Link to={`/naskah/${script.slug}`}>
            {script.title}
          </Link>
        </h3>

        <p className="text-xs font-medium text-muted-foreground mb-3">
          Karya: <span className="text-foreground font-semibold">{script.author}</span>
        </p>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
          {script.synopsis}
        </p>

        {/* Badges Info */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground py-2 border-y border-border/60">
          {script.cast_count !== null && script.cast_count !== undefined && (
            <span className="flex items-center gap-1 font-medium" title="Jumlah Tokoh">
              <Users className="h-3.5 w-3.5 text-primary" />
              {script.cast_count === 1 ? "1 Tokoh (Monolog)" : `${script.cast_count} Tokoh`}
            </span>
          )}
          {script.duration && (
            <span className="flex items-center gap-1 font-medium ml-auto" title="Estimasi Durasi">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {script.duration}
            </span>
          )}
        </div>

        {/* Footer info: views, downloads, CTA */}
        <div className="mt-3 flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1" title="Dilihat">
              <Eye className="h-3.5 w-3.5" />
              {script.views}
            </span>
            <span className="flex items-center gap-1" title="Diunduh">
              <Download className="h-3.5 w-3.5" />
              {script.downloads}
            </span>
          </div>

          <Link
            to={`/naskah/${script.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
          >
            <span>Baca</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
