import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { Script, Category, Tag } from "../types";
import { ScriptCard } from "../components/ScriptCard";
import { FilterSidebar, FilterState } from "../components/FilterSidebar";
import { Pagination } from "../components/Pagination";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  BookOpen,
  Theater,
  ArrowUpDown
} from "lucide-react";

export const ScriptsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Filter state from URL Search Params
  const filters: FilterState = {
    category: searchParams.get("category") || "",
    language: searchParams.get("language") || "",
    genre: searchParams.get("genre") || "",
    performance_type: searchParams.get("performance_type") || "",
    cast_range: searchParams.get("cast_range") || "",
    duration: searchParams.get("duration") || "",
    age_group: searchParams.get("age_group") || "",
    tag: searchParams.get("tag") || "",
    sort: searchParams.get("sort") || "newest",
  };

  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Load Categories & Tags once
  useEffect(() => {
    const loadInitialMetadata = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          api.getCategories(),
          api.getTags(),
        ]);
        setCategories(catsRes);
        setTags(tagsRes);
      } catch (err) {
        console.error("Error loading categories/tags:", err);
      }
    };
    loadInitialMetadata();
  }, []);

  // Fetch scripts when URL search params change
  useEffect(() => {
    const fetchScripts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: "12",
          sort: filters.sort,
        };

        if (searchQuery) params.q = searchQuery;
        if (filters.category) params.category = filters.category;
        if (filters.language) params.language = filters.language;
        if (filters.genre) params.genre = filters.genre;
        if (filters.performance_type) params.performance_type = filters.performance_type;
        if (filters.cast_range) params.cast_range = filters.cast_range;
        if (filters.duration) params.duration = filters.duration;
        if (filters.age_group) params.age_group = filters.age_group;
        if (filters.tag) params.tag = filters.tag;

        const res = await api.getScripts(params);
        setScripts(res.scripts);
        setPagination(res.pagination);
      } catch (err) {
        console.error("Error fetching scripts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  const updateFilters = (newFilters: FilterState) => {
    const nextParams = new URLSearchParams();
    if (searchQuery) nextParams.set("q", searchQuery);
    
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) nextParams.set(k, v);
    });
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string) || "";
    
    const nextParams = new URLSearchParams(searchParams);
    if (q.trim()) {
      nextParams.set("q", q.trim());
    } else {
      nextParams.delete("q");
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRemoveFilter = (key: keyof FilterState) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleResetAll = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", newPage.toString());
    setSearchParams(nextParams);
  };

  // Active filter chips
  const activeChips: { key: keyof FilterState; label: string; value: string }[] = [];
  if (filters.category) {
    const cat = categories.find((c) => c.slug === filters.category || c.id === filters.category);
    activeChips.push({ key: "category", label: "Kategori", value: cat ? cat.name : filters.category });
  }
  if (filters.language) activeChips.push({ key: "language", label: "Bahasa", value: filters.language });
  if (filters.genre) activeChips.push({ key: "genre", label: "Genre", value: filters.genre });
  if (filters.performance_type) activeChips.push({ key: "performance_type", label: "Jenis", value: filters.performance_type });
  if (filters.cast_range) activeChips.push({ key: "cast_range", label: "Pemain", value: filters.cast_range === "1" ? "1 (Monolog)" : `${filters.cast_range} Orang` });
  if (filters.age_group) activeChips.push({ key: "age_group", label: "Usia", value: filters.age_group });
  if (filters.tag) activeChips.push({ key: "tag", label: "Tag", value: `#${filters.tag}` });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Theater className="h-7 w-7 text-blue-600" />
              Katalog Repositori Naskah
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Temukan {pagination.total} naskah drama pilihan siap baca dan unduh.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari judul, tokoh, sinopsis, penulis..."
              className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 py-2.5 pl-10 pr-20 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Active Filter Chips & View Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Active Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>Filter ({activeChips.length})</span>
            </button>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs text-blue-700 font-medium">
                Pencarian: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("q");
                    setSearchParams(next);
                  }}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span className="text-slate-400">{chip.label}:</span>
                <span>{chip.value}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFilter(chip.key)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {(activeChips.length > 0 || searchQuery) && (
              <button
                type="button"
                onClick={handleResetAll}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Reset Semua
              </button>
            )}
          </div>

          {/* Sort & View Mode Switches */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler (Views)</option>
                <option value="downloads">Paling Banyak Diunduh</option>
                <option value="title_asc">Judul (A-Z)</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan List"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <FilterSidebar
            categories={categories}
            tags={tags}
            filters={filters}
            onChange={updateFilters}
            onReset={handleResetAll}
          />
        </div>

        {/* Mobile Filter Sheet Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
            <div className="ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-base font-bold">Filter Naskah</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="py-4">
                  <FilterSidebar
                    categories={categories}
                    tags={tags}
                    filters={filters}
                    onChange={(f) => {
                      updateFilters(f);
                    }}
                    onReset={handleResetAll}
                  />
                </div>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white text-center"
              >
                Terapkan Filter ({pagination.total} Naskah)
              </button>
            </div>
          </div>
        )}

        {/* Scripts Catalog List Area */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent align-[-0.125em]" />
              <p className="mt-3 text-xs text-slate-500 font-medium">Memuat koleksi naskah...</p>
            </div>
          ) : scripts.length > 0 ? (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {scripts.map((script) => (
                  <ScriptCard key={script.id} script={script} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="py-16 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Naskah yang Cocok</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau sesuaikan opsi filter untuk menemukan naskah yang Anda cari.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

