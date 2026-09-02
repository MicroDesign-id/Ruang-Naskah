import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Send,
  FolderTree,
  Tag,
  Flag,
  History,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
  PlusCircle,
  Theater
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
          <p className="mt-2 text-xs text-slate-500 font-medium">Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Naskah", path: "/admin/naskah", icon: BookOpen },
    { name: "Kiriman Naskah", path: "/admin/submissions", icon: Send },
    { name: "Kategori", path: "/admin/kategori", icon: FolderTree },
    { name: "Tag", path: "/admin/tags", icon: Tag },
    { name: "Laporan & Hak Cipta", path: "/admin/laporan", icon: Flag },
    { name: "Log Aktivitas", path: "/admin/audit", icon: History },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/dashboard" && location.pathname !== "/admin/dashboard") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Theater className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Ruang Naskah <span className="bg-blue-600 text-[10px] text-white font-bold px-1.5 py-0.2 rounded">ADMIN</span>
              </span>
              <p className="text-[10px] text-slate-400">Panel Kurator & Pengelola</p>
            </div>
          </Link>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            title="Buka Website Publik"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Link>

          <Link
            to="/admin/naskah/tambah"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tambah Naskah</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Admin User info & logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Body Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shrink-0">
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Admin
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Info Box at Sidebar bottom */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Ruang Naskah Drama v1.0</p>
            <p className="text-[10px] text-slate-400">Baseline PRD/SRS Terverifikasi</p>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
            <div className="w-64 h-full bg-white dark:bg-slate-900 p-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b mb-3">
                  <span className="text-xs font-bold text-slate-400">MENU KURATOR</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Admin Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

