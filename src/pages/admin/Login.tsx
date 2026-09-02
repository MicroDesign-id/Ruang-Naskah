import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Theater, Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("admin@ruangnaskah.id");
  const [password, setPassword] = useState("AdminRuangNaskah2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

  if (user) {
    navigate("/admin/dashboard", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Email atau kata sandi tidak valid.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Theater className="h-6 w-6" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Login Kurator & Admin
        </h1>
        <p className="text-xs text-slate-400">
          Masuk untuk mengelola naskah drama, review submission, dan kurasi koleksi.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Administrator
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ruangnaskah.id"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 pl-10 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-blue-400">Akun Admin Default:</p>
              <p>Email: <span className="text-white font-mono">admin@ruangnaskah.id</span></p>
              <p>Password: <span className="text-white font-mono">AdminRuangNaskah2026!</span></p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Depan Publik</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

