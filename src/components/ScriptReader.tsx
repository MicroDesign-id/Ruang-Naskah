import React, { useState } from "react";
import { Maximize2, Minimize2, Type, Sun, Moon, BookOpen, Printer, Copy, Check } from "lucide-react";

interface ScriptReaderProps {
  title: string;
  author: string;
  content: string;
}

export const ScriptReader: React.FC<ScriptReaderProps> = ({ title, author, content }) => {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [fontFamily, setFontFamily] = useState<"mono" | "sans" | "serif">("mono");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const fontSizeClasses = {
    sm: "text-xs sm:text-sm leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-loose",
    xl: "text-lg sm:text-xl leading-loose",
  };

  const fontClasses = {
    mono: "font-script",
    sans: "font-sans",
    serif: "font-serif-reading",
  };

  const themeClasses = {
    light: "reader-theme-light border-slate-200 shadow-sm",
    sepia: "reader-theme-sepia border-amber-200/80 shadow-sm",
    dark: "reader-theme-dark border-slate-800 shadow-xl",
  };

  // Format content for theater cues and stage directions
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading scene or act like [BABAK 1], SCENE 1, [ADEGAN 1]
      if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        trimmed.startsWith("BABAK") ||
        trimmed.startsWith("ADEGAN") ||
        trimmed.startsWith("SCENE") ||
        trimmed.startsWith("ACT")
      ) {
        return (
          <div key={idx} className="my-6 pt-4 pb-1 border-b border-current/20 font-bold uppercase tracking-wider text-center text-sm opacity-90">
            {trimmed}
          </div>
        );
      }

      // Stage direction in parentheses (e.g. (Tersenyum getir), (Masuk membawa buku))
      if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
        return (
          <div key={idx} className="my-2 italic opacity-80 pl-6 sm:pl-10 text-xs sm:text-sm">
            {trimmed}
          </div>
        );
      }

      // Character Cue (e.g. "ANDI", "BAYU (sambil tertawa)")
      const isCharacterCue = /^[A-Z0-9\s.,'/-]{2,30}(\s*\(.*?\))?$/.test(trimmed) && trimmed.length > 1 && trimmed.length < 40;
      if (isCharacterCue && !trimmed.includes("LATAR") && !trimmed.includes("WAKTU")) {
        return (
          <div key={idx} className="mt-5 mb-1 font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400">
            {trimmed}
          </div>
        );
      }

      // Standard dialogue line
      return (
        <p key={idx} className="min-h-[1.2em] my-1 pl-4 sm:pl-8">
          {line || "\u00A0"}
        </p>
      );
    });
  };

  return (
    <div className={`transition-all ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8 bg-slate-900/90 backdrop-blur-md flex flex-col items-center" : "w-full"}`}>
      <div className={`w-full ${isFullscreen ? "max-w-4xl" : ""}`}>
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-t-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="font-semibold hidden sm:inline">Mode Pembaca Naskah</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Font Family Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setFontFamily("mono")}
                className={`px-2 py-1 rounded text-[11px] font-mono font-medium ${fontFamily === "mono" ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title="Font Monospace Naskah"
              >
                Naskah
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("serif")}
                className={`px-2 py-1 rounded text-[11px] font-serif font-medium ${fontFamily === "serif" ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title="Font Buku Serif"
              >
                Buku
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("sans")}
                className={`px-2 py-1 rounded text-[11px] font-sans font-medium ${fontFamily === "sans" ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title="Font Modern Sans"
              >
                Modern
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {(["sm", "base", "lg", "xl"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${fontSize === size ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  {size === "sm" ? "A-" : size === "base" ? "A" : size === "lg" ? "A+" : "A++"}
                </button>
              ))}
            </div>

            {/* Theme Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded ${theme === "light" ? "bg-slate-200 text-slate-900 font-bold" : "hover:bg-slate-100"}`}
                title="Tema Terang (Putih)"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("sepia")}
                className={`px-2 py-1 rounded text-[11px] font-medium bg-[#fbf0d9] text-[#433422] ${theme === "sepia" ? "ring-2 ring-amber-500" : ""}`}
                title="Tema Sepia (Kertas)"
              >
                Sepia
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded ${theme === "dark" ? "bg-slate-700 text-white" : "hover:bg-slate-100"}`}
                title="Tema Gelap (Malam)"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:text-blue-600"
              title="Salin Naskah"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-block p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:text-blue-600"
              title="Cetak Naskah"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:text-blue-600"
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Reader Document Canvas */}
        <div
          className={`p-6 sm:p-12 rounded-b-2xl border-x border-b ${themeClasses[theme]} ${fontClasses[fontFamily]} ${fontSizeClasses[fontSize]} transition-colors min-h-[500px]`}
        >
          {/* Header info in reading mode */}
          <div className="mb-10 pb-6 border-b border-current/20 text-center">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mb-2">
              {title}
            </h2>
            <p className="text-sm font-medium opacity-80">
              Karya: {author}
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-1">
            {content ? renderFormattedContent(content) : (
              <p className="text-center italic opacity-60 py-10">
                Isi teks naskah belum dimasukkan ke pembaca digital. Anda dapat mengunduh dokumen naskah asli melalui tombol unduh di atas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

