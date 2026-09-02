import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Send, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Naskah", path: "/naskah" },
    { name: "Kirim Naskah", path: "/kirim-naskah" },
    { name: "Tentang", path: "/tentang" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Ruang Naskah Drama
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/kirim-naskah"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Kirim Naskah</span>
          </Link>

          <Link
            to={user ? "/admin/dashboard" : "/admin/login"}
            className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-border/60 flex flex-col gap-2">
            <Link
              to="/kirim-naskah"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirim Naskah</span>
            </Link>

            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <span>{user ? "Masuk ke Panel Admin" : "Admin"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
