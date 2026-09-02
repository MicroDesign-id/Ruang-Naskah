import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" aria-label="Pagination">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span key={`dots-${idx}`} className="px-2 text-xs text-slate-400">
              ...
            </span>
          );
        }

        const pageNum = Number(p);
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`flex h-9 min-w-[2.25rem] px-2 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

