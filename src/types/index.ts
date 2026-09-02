export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  scriptCount?: number;
  totalScripts?: number;
  publishedScripts?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  scriptCount?: number;
}

export interface CastMember {
  name: string;
  role: string;
}

export interface Script {
  id: string;
  title: string;
  slug: string;
  author: string;
  synopsis: string;
  cast_list?: string;
  cast_list_parsed?: CastMember[] | string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  category?: {
    id?: string;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
  };
  language: string;
  genre?: string;
  performance_type?: string;
  duration?: string;
  cast_count?: number;
  age_group?: string;
  content?: string;
  file_url?: string;
  cover_url?: string;
  status: "Draft" | "Pending" | "Disetujui" | "Ditolak" | "Terbit" | "Trash";
  views: number;
  downloads: number;
  created_at: string;
  updated_at?: string;
  tags?: Tag[];
  related?: Script[];
}

export interface Submission {
  id: string;
  contributor_name: string;
  email: string;
  institution?: string;
  title: string;
  author: string;
  category_id: string;
  category_name?: string;
  language: string;
  genre?: string;
  performance_type?: string;
  duration?: string;
  cast_count?: number;
  age_group?: string;
  synopsis: string;
  cast_list?: string;
  tags?: string;
  content?: string;
  file_url?: string;
  status: "Pending" | "Disetujui" | "Ditolak";
  admin_note?: string;
  copyright_agreed: number;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_name?: string;
}

export interface Report {
  id: string;
  report_type: "copyright" | "broken_file" | "inappropriate" | "feedback" | "other";
  script_id?: string;
  script_title?: string;
  linked_script_title?: string;
  linked_script_slug?: string;
  linked_script_status?: string;
  reporter_name: string;
  reporter_email: string;
  description: string;
  proof_url?: string;
  status: "Open" | "In Review" | "Resolved" | "Dismissed";
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  stats: {
    totalScripts: number;
    publishedScripts: number;
    pendingSubmissions: number;
    draftScripts: number;
    trashScripts: number;
    totalViews: number;
    totalDownloads: number;
    contributorsCount: number;
  };
  topViewed: Script[];
  topDownloaded: Script[];
  recentSubmissions: Submission[];
  recentAuditLogs: AuditLog[];
}

