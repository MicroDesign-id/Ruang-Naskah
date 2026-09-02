import { Script, Category, Tag, Submission, Report, DashboardStats, AdminUser } from "../types";

const API_BASE = "/api";

// Helper for fetch with JSON parsing and error handling
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("rn_admin_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set JSON content-type if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP Error ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Public Endpoints
  getFeatured: () => request<{ recent: Script[]; popular: Script[] }>("/featured"),
  
  getCategories: () => request<Category[]>("/categories"),
  
  getTags: () => request<Tag[]>("/tags"),
  
  getScripts: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<{ scripts: Script[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/scripts?${query}`);
  },
  
  getScriptBySlug: (slug: string) => request<Script>(`/scripts/${slug}`),
  
  submitScript: (formData: FormData) => request<{ success: boolean; message: string; submission_id: string }>("/submissions", {
    method: "POST",
    body: formData,
  }),
  
  submitReport: (data: Partial<Report>) => request<{ success: boolean; message: string; report_id: string }>("/reports", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Admin Auth
  adminLogin: (email: string, password: string) => request<{ success: boolean; token: string; user: AdminUser }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }),
  
  adminLogout: () => request<{ success: boolean; message: string }>("/admin/logout", {
    method: "POST",
  }),
  
  adminMe: () => request<{ user: AdminUser }>("/admin/me"),

  // Admin Dashboard
  getDashboard: () => request<DashboardStats>("/admin/dashboard"),

  // Admin Scripts Management
  getAdminScripts: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<{ scripts: Script[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/admin/scripts?${query}`);
  },
  
  getAdminScriptById: (id: string) => request<Script & { tags: string[]; tags_detail: Tag[] }>(`/admin/scripts/${id}`),
  
  createAdminScript: (data: any) => request<{ success: boolean; message: string; script_id: string; slug: string }>("/admin/scripts", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  updateAdminScript: (id: string, data: any) => request<{ success: boolean; message: string; slug: string }>(`/admin/scripts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  
  trashAdminScript: (id: string) => request<{ success: boolean; message: string }>(`/admin/scripts/${id}`, {
    method: "DELETE",
  }),
  
  restoreAdminScript: (id: string, target_status: "Draft" | "Terbit" = "Draft") => request<{ success: boolean; message: string }>(`/admin/scripts/${id}/restore`, {
    method: "POST",
    body: JSON.stringify({ target_status }),
  }),
  
  permanentDeleteAdminScript: (id: string) => request<{ success: boolean; message: string }>(`/admin/scripts/${id}/permanent`, {
    method: "DELETE",
  }),

  // Admin Submissions
  getAdminSubmissions: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<{ submissions: Submission[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/admin/submissions?${query}`);
  },
  
  getAdminSubmissionById: (id: string) => request<Submission>(`/admin/submissions/${id}`),
  
  approveSubmission: (id: string, data: { publish_status: "Terbit" | "Draft"; admin_note?: string; title?: string; author?: string; category_id?: string; synopsis?: string; content?: string }) => 
    request<{ success: boolean; message: string; script_id: string; slug: string }>(`/admin/submissions/${id}/approve`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  rejectSubmission: (id: string, admin_note: string) => 
    request<{ success: boolean; message: string }>(`/admin/submissions/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ admin_note }),
    }),

  // Admin Categories
  getAdminCategories: () => request<Category[]>("/admin/categories"),
  
  saveAdminCategory: (data: Partial<Category>) => request<{ success: boolean; message: string }>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  deleteAdminCategory: (id: string) => request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
    method: "DELETE",
  }),

  // Admin Tags
  getAdminTags: () => request<Tag[]>("/admin/tags"),
  
  saveAdminTag: (data: { id?: string; name: string }) => request<{ success: boolean; message: string }>("/admin/tags", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  deleteAdminTag: (id: string) => request<{ success: boolean; message: string }>(`/admin/tags/${id}`, {
    method: "DELETE",
  }),

  // Admin Reports
  getAdminReports: () => request<Report[]>("/admin/reports"),
  
  updateReportStatus: (id: string, status: string, admin_notes?: string) => request<{ success: boolean; message: string }>(`/admin/reports/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, admin_notes }),
  }),
  
  unpublishReportedScript: (id: string) => request<{ success: boolean; message: string }>(`/admin/reports/${id}/unpublish-script`, {
    method: "POST",
  }),

  // Admin Audit Logs
  getAdminAuditLogs: () => request<any[]>("/admin/audit-logs"),

  // Admin File Uploads
  uploadCover: (formData: FormData) => request<{ success: boolean; url: string; filename: string }>("/admin/upload/cover", {
    method: "POST",
    body: formData,
  }),
  
  uploadDocument: (formData: FormData) => request<{ success: boolean; url: string; filename: string }>("/admin/upload/document", {
    method: "POST",
    body: formData,
  }),
};

