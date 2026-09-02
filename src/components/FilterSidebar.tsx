import React from "react";
import { Filter, RotateCcw, Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Category, Tag } from "../types";

export interface FilterState {
  category: string;
  language: string;
  genre: string;
  performance_type: string;
  cast_range: string;
  duration: string;
  age_group: string;
  tag: string;
  sort: string;
}

interface FilterSidebarProps {
  categories: Category[];
  tags: Tag[];
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  tags,
  filters,
  onChange,
  onReset,
}) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? "" : value, // toggle if same
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== "sort" && Boolean(v));

  return (
    <aside className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Filter Naskah
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filter
          </button>
        )}
      </div>

      {/* 1. Kategori */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Kategori
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateFilter("category", cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.scriptCount !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    {cat.scriptCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Jumlah Pemain / Cast Range */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Jumlah Pemain / Tokoh
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "1 (Monolog)", value: "1" },
            { label: "2 - 5 Pemain", value: "2-5" },
            { label: "6 - 10 Pemain", value: "6-10" },
            { label: "> 10 Pemain", value: "10+" },
          ].map((item) => {
            const isSelected = filters.cast_range === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter("cast_range", item.value)}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold dark:bg-blue-950/50 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300 dark:text-slate-400"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bahasa */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Bahasa
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {["Bahasa Indonesia", "Bahasa Jawa", "Bahasa Inggris", "Bahasa Sunda"].map((lang) => {
            const isSelected = filters.language === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => updateFilter("language", lang)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Jenis Pertunjukan */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Jenis Pertunjukan
        </h3>
        <div className="space-y-1">
          {[
            "Teater Panggung",
            "Monolog",
            "Skenario Film Pendek",
            "Drama Radio / Audio",
            "Pembacaan Naskah (Dramatic Reading)",
          ].map((type) => {
            const isSelected = filters.performance_type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => updateFilter("performance_type", type)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <span>{type}</span>
                {isSelected && <Check className="h-3 w-3 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Kelompok Usia */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Kelompok Usia
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {["Remaja (SMP/SMA)", "Umum", "Dewasa", "Anak-anak"].map((age) => {
            const isSelected = filters.age_group === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => updateFilter("age_group", age)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center truncate transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {age}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Tags */}
      {tags && tags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Tag Populer
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 12).map((t) => {
              const isSelected = filters.tag === t.slug || filters.tag === t.name;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateFilter("tag", t.slug)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  #{t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

