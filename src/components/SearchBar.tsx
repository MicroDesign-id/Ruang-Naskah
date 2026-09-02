import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  size?: "default" | "large";
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  placeholder = "Cari judul naskah, nama penulis, tokoh, tema, atau kata kunci...",
  size = "large",
  onSearch
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/naskah?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div className={`relative flex items-center rounded-2xl bg-card border border-border/80 shadow-xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${
        isLarge ? "p-2 sm:p-2.5" : "p-1.5"
      }`}>
        <div className="flex items-center justify-center pl-3 pr-2 text-muted-foreground">
          <Search className={isLarge ? "h-5 w-5 text-primary" : "h-4 w-4 text-primary"} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none ${
            isLarge ? "text-base font-normal" : "text-sm"
          }`}
        />
        <button
          type="submit"
          className={`flex items-center gap-1.5 rounded-xl bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-98 transition-all shrink-0 ${
            isLarge ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          <span>Cari</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Quick search tags suggestions for large search */}
      {isLarge && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground justify-center">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Pencarian populer:
          </span>
          {["Drama Remaja", "Monolog", "FLS2N", "Komedi", "Bahasa Jawa", "Islami", "3-5 Pemain"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                navigate(`/naskah?q=${encodeURIComponent(item)}`);
              }}
              className="rounded-full bg-card border border-border px-2.5 py-1 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};
