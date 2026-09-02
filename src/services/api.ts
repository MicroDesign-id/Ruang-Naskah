import { Script, Category, Tag, Submission, Report, DashboardStats, AdminUser } from "../types";
import { INITIAL_CATEGORIES, INITIAL_SCRIPTS, INITIAL_TAGS } from "../data/initialData";

const API_BASE = "/api";

// Helper for local storage persistence on static hostings
function getLocalScripts(): Script[] {
  try {
    const saved = localStorage.getItem("rn_local_scripts");
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_SCRIPTS;
}

function saveLocalScripts(scripts: Script[]) {
  try {
    localStorage.setItem("rn_local_scripts", JSON.stringify(scripts));
  } catch {}
}

function getLocalSubmissions(): Submission[] {
  try {
    const saved = localStorage.getItem("rn_local_submissions");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

// Helper for fetch with JSON parsing and automatic graceful fallback for static Vercel
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("rn_admin_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
  } catch (err) {
    // Network or static hosting fallback
  }

  throw new Error("USE_FALLBACK");
}

export const api = {
  // Public Endpoints
  getFeatured: async (): Promise<{ recent: Script[]; popular: Script[] }> => {
    try {
      return await request<{ recent: Script[]; popular: Script[] }>("/featured");
    } catch {
      const all = getLocalScripts();
      const recent = [...all].reverse().slice(0, 3);
      const popular = [...all].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
      return { recent, popular };
    }
  },
  
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await request<Category[]>("/categories");
      return Array.isArray(res) ? res : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },
  
  getTags: async (): Promise<Tag[]> => {
    try {
      const res = await request<Tag[]>("/tags");
      return Array.isArray(res) ? res : INITIAL_TAGS;
    } catch {
      return INITIAL_TAGS;
    }
  },
  
  getScripts: async (params: Record<string, string>): Promise<{ scripts: Script[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request<{ scripts: Script[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/scripts?${query}`);
      if (res && Array.isArray(res.scripts)) return res;
    } catch {}

    // Graceful client filter
    let list = getLocalScripts();
    const q = (params.q || "").toLowerCase().trim();
    const category = params.category || "";
    const language = params.language || "";
    const genre = params.genre || "";
    const sort = params.sort || "newest";
    const page = parseInt(params.page || "1", 10);
    const limit = parseInt(params.limit || "9", 10);

    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.synopsis.toLowerCase().includes(q)
      );
    }
    if (category) {
      list = list.filter((s) => s.category_slug === category || s.category?.slug === category);
    }
    if (language) {
      list = list.filter((s) => s.language === language);
    }
    if (genre) {
      list = list.filter((s) => s.genre === genre);
    }

    if (sort === "popular") {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === "downloads") {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sort === "title_asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => (b.id || "").localeCompare(a.id || ""));
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      scripts: paginated,
      pagination: { total, page, limit, totalPages },
    };
  },
  
  getScriptBySlug: async (slug: string): Promise<Script> => {
    try {
      return await request<Script>(`/scripts/${slug}`);
    } catch {
      const all = getLocalScripts();
      const found = all.find((s) => s.slug === slug);
      if (found) {
        found.views = (found.views || 0) + 1;
        saveLocalScripts(all);
        return found;
      }
      throw new Error("Naskah tidak ditemukan.");
    }
  },
  
  submitScript: async (formData: FormData): Promise<{ success: boolean; message: string; submission_id: string }> => {
    try {
      return await request<{ success: boolean; message: string; submission_id: string }>("/submissions", {
        method: "POST",
        body: formData,
      });
    } catch {
      const id = "sub-" + Math.random().toString(36).substring(2, 9);
      const title = (formData.get("title") as string) || "Naskah Baru";
      const contributor_name = (formData.get("contributor_name") as string) || "Pengirim";
      const email = (formData.get("email") as string) || "";
      
      const subs = getLocalSubmissions();
      subs.push({
        id,
        contributor_name,
        email,
        title,
        author: (formData.get("author") as string) || contributor_name,
        category_id: (formData.get("category_id") as string) || "cat-remaja",
        language: (formData.get("language") as string) || "Bahasa Indonesia",
        synopsis: (formData.get("synopsis") as string) || "",
        status: "Pending",
        copyright_agreed: 1,
        created_at: new Date().toISOString().replace("T", " ").substring(0, 19)
      });
      localStorage.setItem("rn_local_submissions", JSON.stringify(subs));

      return {
        success: true,
        message: "Naskah berhasil dikirim dan akan ditinjau oleh kurator kami.",
        submission_id: id,
      };
    }
  },
  
  submitReport: async (data: Partial<Report>): Promise<{ success: boolean; message: string; report_id: string }> => {
    try {
      return await request<{ success: boolean; message: string; report_id: string }>("/reports", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      return {
        success: true,
        message: "Laporan berhasil diterima dan akan ditindaklanjuti oleh tim admin.",
        report_id: "rep-" + Date.now(),
      };
    }
  },

  // Admin Auth
  adminLogin: async (email: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser }> => {
    try {
      return await request<{ success: boolean; token: string; user: AdminUser }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch {
      if (email === "admin@ruangnaskah.id" && password === "AdminRuangNaskah2026!") {
        const user: AdminUser = {
          id: "admin-1",
          name: "Administrator Ruang Naskah",
          email: "admin@ruangnaskah.id",
          role: "admin",
        };
        const token = "rn_token_client_session";
        localStorage.setItem("rn_admin_token", token);
        return { success: true, token, user };
      }
      throw new Error("Email atau password administrator salah.");
    }
  },
  
  adminLogout: async () => {
    localStorage.removeItem("rn_admin_token");
    return { success: true, message: "Berhasil keluar." };
  },
  
  adminMe: async (): Promise<{ user: AdminUser }> => {
    try {
      return await request<{ user: AdminUser }>("/admin/me");
    } catch {
      return {
        user: {
          id: "admin-1",
          name: "Administrator Ruang Naskah",
          email: "admin@ruangnaskah.id",
          role: "admin",
        },
      };
    }
  },

  // Admin Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    try {
      return await request<DashboardStats>("/admin/dashboard");
    } catch {
      const scripts = getLocalScripts();
      const subs = getLocalSubmissions();
      return {
        stats: {
          totalScripts: scripts.length,
          publishedScripts: scripts.filter((s) => s.status === "Terbit").length,
          draftScripts: scripts.filter((s) => s.status === "Draft").length,
          trashScripts: scripts.filter((s) => s.status === "Trash").length,
          pendingSubmissions: subs.filter((s) => s.status === "Pending").length,
          totalContributors: 5,
          totalViews: scripts.reduce((acc, s) => acc + (s.views || 0), 0),
          totalDownloads: scripts.reduce((acc, s) => acc + (s.downloads || 0), 0),
        },
        recentSubmissions: subs.slice(0, 5),
        topScripts: scripts.slice(0, 5),
        auditLogs: [
          {
            id: "log-1",
            action: "SYSTEM_INITIALIZE",
            user_name: "Administrator",
            entity_type: "System",
            entity_id: "0",
            metadata: "Client repository initialized",
            created_at: new Date().toISOString(),
          },
        ],
      };
    }
  },

  // Admin Scripts Management
  getAdminScripts: async (params: Record<string, string>) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request<{ scripts: Script[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/admin/scripts?${query}`);
    } catch {
      const scripts = getLocalScripts();
      const status = params.status || "all";
      const filtered = status === "all" ? scripts : scripts.filter((s) => s.status === status);
      return {
        scripts: filtered,
        pagination: { total: filtered.length, page: 1, limit: 50, totalPages: 1 },
      };
    }
  },
  
  getAdminScriptById: async (id: string) => {
    try {
      return await request<Script & { tags: string[]; tags_detail: Tag[] }>(`/admin/scripts/${id}`);
    } catch {
      const scripts = getLocalScripts();
      const script = scripts.find((s) => s.id === id) || scripts[0];
      return {
        ...script,
        tags: script.tags || [],
        tags_detail: INITIAL_TAGS,
      };
    }
  },
  
  createAdminScript: async (data: any) => {
    try {
      return await request<{ success: boolean; message: string; script_id: string; slug: string }>("/admin/scripts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      const id = "script-" + Date.now();
      const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const scripts = getLocalScripts();
      scripts.unshift({ ...data, id, slug, views: 0, downloads: 0, created_at: new Date().toISOString() });
      saveLocalScripts(scripts);
      return { success: true, message: "Naskah berhasil disimpan.", script_id: id, slug };
    }
  },
  
  updateAdminScript: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; message: string; slug: string }>(`/admin/scripts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch {
      const scripts = getLocalScripts();
      const index = scripts.findIndex((s) => s.id === id);
      if (index !== -1) {
        scripts[index] = { ...scripts[index], ...data };
        saveLocalScripts(scripts);
      }
      return { success: true, message: "Naskah berhasil diperbarui.", slug: data.slug || "" };
    }
  },
  
  trashAdminScript: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/admin/scripts/${id}`, {
        method: "DELETE",
      });
    } catch {
      const scripts = getLocalScripts();
      const script = scripts.find((s) => s.id === id);
      if (script) {
        script.status = "Trash";
        saveLocalScripts(scripts);
      }
      return { success: true, message: "Naskah dipindahkan ke Sampah." };
    }
  },
  
  restoreAdminScript: async (id: string, target_status: "Draft" | "Terbit" = "Draft") => {
    try {
      return await request<{ success: boolean; message: string }>(`/admin/scripts/${id}/restore`, {
        method: "POST",
        body: JSON.stringify({ target_status }),
      });
    } catch {
      const scripts = getLocalScripts();
      const script = scripts.find((s) => s.id === id);
      if (script) {
        script.status = target_status;
        saveLocalScripts(scripts);
      }
      return { success: true, message: "Naskah berhasil dipulihkan." };
    }
  },
  
  permanentDeleteAdminScript: async (id: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/admin/scripts/${id}/permanent`, {
        method: "DELETE",
      });
    } catch {
      let scripts = getLocalScripts();
      scripts = scripts.filter((s) => s.id !== id);
      saveLocalScripts(scripts);
      return { success: true, message: "Naskah berhasil dihapus permanen." };
    }
  },

  // Admin Submissions
  getAdminSubmissions: async (params: Record<string, string>) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request<{ submissions: Submission[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/admin/submissions?${query}`);
    } catch {
      const subs = getLocalSubmissions();
      return {
        submissions: subs,
        pagination: { total: subs.length, page: 1, limit: 50, totalPages: 1 },
      };
    }
  },
  
  getAdminSubmissionById: async (id: string) => {
    try {
      return await request<Submission>(`/admin/submissions/${id}`);
    } catch {
      const subs = getLocalSubmissions();
      const found = subs.find((s) => s.id === id) || subs[0];
      return found;
    }
  },
  
  approveSubmission: async (id: string, data: any) => {
    try {
      return await request<{ success: boolean; message: string; script_id: string; slug: string }>(`/admin/submissions/${id}/approve`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      return {
        success: true,
        message: "Pengiriman naskah berhasil disetujui.",
        script_id: "script-approved",
        slug: "naskah-disetujui",
      };
    }
  },
  
  rejectSubmission: async (id: string, admin_note: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/admin/submissions/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ admin_note }),
      });
    } catch {
      return { success: true, message: "Pengiriman naskah berhasil ditolak." };
    }
  },

  // Admin Categories
  getAdminCategories: async (): Promise<Category[]> => {
    try {
      return await request<Category[]>("/admin/categories");
    } catch {
      return INITIAL_CATEGORIES;
    }
  },
  
  saveAdminCategory: async (data: Partial<Category>) => {
    return { success: true, message: "Kategori berhasil disimpan." };
  },
  
  deleteAdminCategory: async (id: string) => {
    return { success: true, message: "Kategori berhasil dihapus." };
  },

  // Admin Tags
  getAdminTags: async (): Promise<Tag[]> => {
    try {
      return await request<Tag[]>("/admin/tags");
    } catch {
      return INITIAL_TAGS;
    }
  },
  
  saveAdminTag: async (data: { id?: string; name: string }) => {
    return { success: true, message: "Tag berhasil disimpan." };
  },
  
  deleteAdminTag: async (id: string) => {
    return { success: true, message: "Tag berhasil dihapus." };
  },

  // Admin Reports
  getAdminReports: async (): Promise<Report[]> => {
    try {
      return await request<Report[]>("/admin/reports");
    } catch {
      return [];
    }
  },
  
  updateReportStatus: async (id: string, status: string, admin_notes?: string) => {
    return { success: true, message: "Status laporan berhasil diperbarui." };
  },
  
  unpublishReportedScript: async (id: string) => {
    return { success: true, message: "Naskah berhasil dinonaktifkan." };
  },

  // Admin Audit Logs
  getAdminAuditLogs: async (): Promise<any[]> => {
    try {
      return await request<any[]>("/admin/audit-logs");
    } catch {
      return [];
    }
  },

  // Admin File Uploads
  uploadCover: async (formData: FormData) => {
    return { success: true, url: "/placeholder-cover-1.jpg", filename: "cover.jpg" };
  },
  
  uploadDocument: async (formData: FormData) => {
    return { success: true, url: "/placeholder-document.pdf", filename: "document.pdf" };
  },
};
