import { Response } from "express";
import { AuthRequest, generateToken } from "../middleware/auth";
import { db } from "../db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logAudit } from "./public";

// Helper to generate clean unique slug
function generateSlug(text: string, existingId?: string): string {
  let baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) baseSlug = "naskah-" + Date.now();

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = db.query("SELECT id FROM scripts WHERE slug = ? AND id != ?").get(slug, existingId || "") as any;
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// 1. POST /api/admin/login
export function adminLogin(req: AuthRequest, res: Response): void {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email dan kata sandi wajib diisi." });
      return;
    }

    const user = db.query("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase()) as any;
    if (!user) {
      res.status(401).json({ error: "Email atau kata sandi salah." });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      logAudit("LOGIN_FAILED", "users", user.id, { email });
      res.status(401).json({ error: "Email atau kata sandi salah." });
      return;
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    logAudit("LOGIN_SUCCESS", "users", user.id, { email }, user.id, user.name);

    // Set secure cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax"
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat otentikasi." });
  }
}

// 2. POST /api/admin/logout
export function adminLogout(req: AuthRequest, res: Response): void {
  res.clearCookie("auth_token");
  res.json({ success: true, message: "Berhasil logout." });
}

// 3. GET /api/admin/me
export function adminMe(req: AuthRequest, res: Response): void {
  res.json({ user: req.user });
}

// 4. GET /api/admin/dashboard
export function getAdminDashboard(req: AuthRequest, res: Response): void {
  try {
    // Metrics
    const totalScripts = (db.query("SELECT COUNT(*) as c FROM scripts WHERE status != 'Trash'").get() as any).c;
    const publishedScripts = (db.query("SELECT COUNT(*) as c FROM scripts WHERE status = 'Terbit'").get() as any).c;
    const pendingSubmissions = (db.query("SELECT COUNT(*) as c FROM submissions WHERE status = 'Pending'").get() as any).c;
    const draftScripts = (db.query("SELECT COUNT(*) as c FROM scripts WHERE status = 'Draft'").get() as any).c;
    const trashScripts = (db.query("SELECT COUNT(*) as c FROM scripts WHERE status = 'Trash'").get() as any).c;
    
    const totalViews = (db.query("SELECT SUM(views) as s FROM scripts").get() as any).s || 0;
    const totalDownloads = (db.query("SELECT SUM(downloads) as s FROM scripts").get() as any).s || 0;

    const contributorsCount = (db.query("SELECT COUNT(DISTINCT email) as c FROM submissions").get() as any).c;

    // Top viewed scripts
    const topViewed = db.query(`
      SELECT id, title, slug, author, views, downloads, status
      FROM scripts
      WHERE status != 'Trash'
      ORDER BY views DESC
      LIMIT 5
    `).all();

    // Top downloaded scripts
    const topDownloaded = db.query(`
      SELECT id, title, slug, author, views, downloads, status
      FROM scripts
      WHERE status != 'Trash'
      ORDER BY downloads DESC
      LIMIT 5
    `).all();

    // Recent Pending Submissions
    const recentSubmissions = db.query(`
      SELECT s.id, s.title, s.author, s.contributor_name, s.email, s.created_at, c.name as category_name
      FROM submissions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.status = 'Pending'
      ORDER BY s.created_at DESC
      LIMIT 5
    `).all();

    // Recent Audit Logs
    const recentAuditLogs = db.query(`
      SELECT id, user_name, action, entity_type, entity_id, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    res.json({
      stats: {
        totalScripts,
        publishedScripts,
        pendingSubmissions,
        draftScripts,
        trashScripts,
        totalViews,
        totalDownloads,
        contributorsCount
      },
      topViewed,
      topDownloaded,
      recentSubmissions,
      recentAuditLogs
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Gagal memuat data dashboard." });
  }
}

// 5. GET /api/admin/scripts (Full management list)
export function getAdminScripts(req: AuthRequest, res: Response): void {
  try {
    const { status, q, category_id, page = "1", limit = "15", sort = "newest" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== "all") {
      conditions.push("s.status = ?");
      params.push(status);
    }

    if (category_id) {
      conditions.push("s.category_id = ?");
      params.push(category_id);
    }

    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      conditions.push("(s.title LIKE ? OR s.author LIKE ? OR s.synopsis LIKE ?)");
      params.push(search, search, search);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "s.created_at DESC";
    if (sort === "views") orderBy = "s.views DESC";
    if (sort === "downloads") orderBy = "s.downloads DESC";
    if (sort === "title") orderBy = "s.title ASC";

    const countRow = db.query(`
      SELECT COUNT(*) as total FROM scripts s ${whereClause}
    `).get(...params) as { total: number };
    const total = countRow ? countRow.total : 0;

    const scripts = db.query(`
      SELECT 
        s.id, s.title, s.slug, s.author, s.category_id, s.language, s.genre,
        s.performance_type, s.duration, s.cast_count, s.age_group, s.cover_url,
        s.file_url, s.status, s.views, s.downloads, s.created_at, s.updated_at,
        c.name as category_name
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...params, limitNum, offset);

    res.json({
      scripts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err: any) {
    console.error("Admin scripts error:", err);
    res.status(500).json({ error: "Gagal memuat naskah." });
  }
}

// 6. POST /api/admin/scripts (Create Script)
export function createAdminScript(req: AuthRequest, res: Response): void {
  try {
    const {
      title,
      slug: customSlug,
      author,
      synopsis,
      cast_list,
      category_id,
      language = "Bahasa Indonesia",
      genre,
      performance_type,
      duration,
      cast_count,
      age_group,
      content,
      cover_url,
      file_url,
      status = "Draft",
      tags
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: "Judul naskah wajib diisi." });
      return;
    }

    if (!author || !author.trim()) {
      res.status(400).json({ error: "Penulis naskah wajib diisi." });
      return;
    }

    if (!category_id) {
      res.status(400).json({ error: "Kategori naskah wajib dipilih." });
      return;
    }

    if (!synopsis || !synopsis.trim()) {
      res.status(400).json({ error: "Sinopsis wajib diisi." });
      return;
    }

    const scriptId = crypto.randomUUID();
    const finalSlug = customSlug && customSlug.trim() ? generateSlug(customSlug) : generateSlug(title);
    const castCountNum = cast_count ? parseInt(cast_count, 10) || null : null;

    db.query(`
      INSERT INTO scripts (
        id, title, slug, author, synopsis, cast_list, category_id,
        language, genre, performance_type, duration, cast_count,
        age_group, content, cover_url, file_url, status, views, downloads,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, datetime('now'), datetime('now'))
    `).run(
      scriptId,
      title.trim(),
      finalSlug,
      author.trim(),
      synopsis.trim(),
      cast_list ? (typeof cast_list === "string" ? cast_list : JSON.stringify(cast_list)) : null,
      category_id,
      language.trim(),
      genre ? genre.trim() : null,
      performance_type ? performance_type.trim() : null,
      duration ? duration.trim() : null,
      castCountNum,
      age_group ? age_group.trim() : null,
      content ? content.trim() : null,
      cover_url || null,
      file_url || null,
      status
    );

    // Save Tags
    if (tags && Array.isArray(tags)) {
      for (const tagId of tags) {
        db.query("INSERT OR IGNORE INTO script_tags (script_id, tag_id) VALUES (?, ?)").run(scriptId, tagId);
      }
    }

    logAudit("CREATE_SCRIPT", "scripts", scriptId, { title, status }, req.user?.id, req.user?.name);

    res.status(201).json({
      success: true,
      message: "Naskah berhasil disimpan.",
      script_id: scriptId,
      slug: finalSlug
    });
  } catch (err: any) {
    console.error("Create script error:", err);
    res.status(500).json({ error: "Gagal menyimpan naskah." });
  }
}

// 7. GET /api/admin/scripts/:id (Get script for edit)
export function getAdminScriptById(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const script = db.query(`
      SELECT s.*, c.name as category_name
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `).get(id) as any;

    if (!script) {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    const tags = db.query(`
      SELECT t.id, t.name, t.slug
      FROM script_tags st
      JOIN tags t ON st.tag_id = t.id
      WHERE st.script_id = ?
    `).all(id) as any[];

    res.json({
      ...script,
      tags: tags.map(t => t.id),
      tags_detail: tags
    });
  } catch (err: any) {
    console.error("Get script error:", err);
    res.status(500).json({ error: "Gagal mengambil data naskah." });
  }
}

// 8. PUT /api/admin/scripts/:id (Update Script)
export function updateAdminScript(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const existing = db.query("SELECT * FROM scripts WHERE id = ?").get(id) as any;
    if (!existing) {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    const {
      title,
      slug: customSlug,
      author,
      synopsis,
      cast_list,
      category_id,
      language,
      genre,
      performance_type,
      duration,
      cast_count,
      age_group,
      content,
      cover_url,
      file_url,
      status,
      tags
    } = req.body;

    const finalSlug = customSlug && customSlug.trim() ? generateSlug(customSlug, id) : existing.slug;
    const castCountNum = cast_count ? parseInt(cast_count, 10) || null : null;

    db.query(`
      UPDATE scripts SET
        title = ?,
        slug = ?,
        author = ?,
        synopsis = ?,
        cast_list = ?,
        category_id = ?,
        language = ?,
        genre = ?,
        performance_type = ?,
        duration = ?,
        cast_count = ?,
        age_group = ?,
        content = ?,
        cover_url = ?,
        file_url = ?,
        status = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      title ? title.trim() : existing.title,
      finalSlug,
      author ? author.trim() : existing.author,
      synopsis ? synopsis.trim() : existing.synopsis,
      cast_list !== undefined ? (typeof cast_list === "string" ? cast_list : JSON.stringify(cast_list)) : existing.cast_list,
      category_id || existing.category_id,
      language ? language.trim() : existing.language,
      genre !== undefined ? (genre ? genre.trim() : null) : existing.genre,
      performance_type !== undefined ? (performance_type ? performance_type.trim() : null) : existing.performance_type,
      duration !== undefined ? (duration ? duration.trim() : null) : existing.duration,
      castCountNum !== undefined ? castCountNum : existing.cast_count,
      age_group !== undefined ? (age_group ? age_group.trim() : null) : existing.age_group,
      content !== undefined ? (content ? content.trim() : null) : existing.content,
      cover_url !== undefined ? cover_url : existing.cover_url,
      file_url !== undefined ? file_url : existing.file_url,
      status || existing.status,
      id
    );

    // Update tags
    if (tags && Array.isArray(tags)) {
      db.query("DELETE FROM script_tags WHERE script_id = ?").run(id);
      for (const tagId of tags) {
        db.query("INSERT OR IGNORE INTO script_tags (script_id, tag_id) VALUES (?, ?)").run(id, tagId);
      }
    }

    logAudit("UPDATE_SCRIPT", "scripts", id, { title, status }, req.user?.id, req.user?.name);

    res.json({
      success: true,
      message: "Naskah berhasil diperbarui.",
      slug: finalSlug
    });
  } catch (err: any) {
    console.error("Update script error:", err);
    res.status(500).json({ error: "Gagal memperbarui naskah." });
  }
}

// 9. DELETE /api/admin/scripts/:id (Move to Trash)
export function trashAdminScript(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const script = db.query("SELECT * FROM scripts WHERE id = ?").get(id) as any;
    if (!script) {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    db.query("UPDATE scripts SET status = 'Trash', updated_at = datetime('now') WHERE id = ?").run(id);
    logAudit("TRASH_SCRIPT", "scripts", id, { title: script.title }, req.user?.id, req.user?.name);

    res.json({ success: true, message: `Naskah "${script.title}" berhasil dipindahkan ke Sampah.` });
  } catch (err: any) {
    console.error("Trash script error:", err);
    res.status(500).json({ error: "Gagal memindahkan naskah ke sampah." });
  }
}

// 10. POST /api/admin/scripts/:id/restore (Restore from Trash)
export function restoreAdminScript(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const { target_status = "Draft" } = req.body;

    const script = db.query("SELECT * FROM scripts WHERE id = ?").get(id) as any;
    if (!script) {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    const restoreStatus = target_status === "Terbit" ? "Terbit" : "Draft";
    db.query("UPDATE scripts SET status = ?, updated_at = datetime('now') WHERE id = ?").run(restoreStatus, id);
    logAudit("RESTORE_SCRIPT", "scripts", id, { title: script.title, target_status: restoreStatus }, req.user?.id, req.user?.name);

    res.json({ success: true, message: `Naskah "${script.title}" berhasil dipulihkan dengan status ${restoreStatus}.` });
  } catch (err: any) {
    console.error("Restore script error:", err);
    res.status(500).json({ error: "Gagal memulihkan naskah." });
  }
}

// 11. DELETE /api/admin/scripts/:id/permanent (Permanent Delete)
export function permanentDeleteAdminScript(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const script = db.query("SELECT * FROM scripts WHERE id = ?").get(id) as any;
    if (!script) {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    // Delete script_tags
    db.query("DELETE FROM script_tags WHERE script_id = ?").run(id);
    // Delete script
    db.query("DELETE FROM scripts WHERE id = ?").run(id);

    logAudit("PERMANENT_DELETE_SCRIPT", "scripts", id, { title: script.title }, req.user?.id, req.user?.name);

    res.json({ success: true, message: `Naskah "${script.title}" telah dihapus secara permanen.` });
  } catch (err: any) {
    console.error("Permanent delete error:", err);
    res.status(500).json({ error: "Gagal menghapus naskah secara permanen." });
  }
}

// 12. GET /api/admin/submissions (List Submissions)
export function getAdminSubmissions(req: AuthRequest, res: Response): void {
  try {
    const { status = "all", page = "1", limit = "15" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== "all") {
      conditions.push("s.status = ?");
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRow = db.query(`SELECT COUNT(*) as total FROM submissions s ${whereClause}`).get(...params) as { total: number };
    const total = countRow ? countRow.total : 0;

    const submissions = db.query(`
      SELECT 
        s.*,
        c.name as category_name
      FROM submissions s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limitNum, offset);

    res.json({
      submissions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err: any) {
    console.error("Admin submissions error:", err);
    res.status(500).json({ error: "Gagal memuat daftar kiriman naskah." });
  }
}

// 13. GET /api/admin/submissions/:id
export function getAdminSubmissionById(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const sub = db.query(`
      SELECT s.*, c.name as category_name, u.name as reviewer_name
      FROM submissions s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN users u ON s.reviewed_by = u.id
      WHERE s.id = ?
    `).get(id);

    if (!sub) {
      res.status(404).json({ error: "Data kiriman naskah tidak ditemukan." });
      return;
    }

    res.json(sub);
  } catch (err: any) {
    console.error("Get submission error:", err);
    res.status(500).json({ error: "Gagal memuat detail pengiriman." });
  }
}

// 14. POST /api/admin/submissions/:id/approve (Approve & Publish / Draft)
export function approveAdminSubmission(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const {
      publish_status = "Terbit",
      admin_note,
      title: editTitle,
      author: editAuthor,
      category_id: editCategoryId,
      synopsis: editSynopsis,
      content: editContent
    } = req.body;

    const sub = db.query("SELECT * FROM submissions WHERE id = ?").get(id) as any;
    if (!sub) {
      res.status(404).json({ error: "Data kiriman tidak ditemukan." });
      return;
    }

    const title = editTitle || sub.title;
    const author = editAuthor || sub.author;
    const category_id = editCategoryId || sub.category_id;
    const synopsis = editSynopsis || sub.synopsis;
    const content = editContent !== undefined ? editContent : sub.content;
    const finalSlug = generateSlug(title);
    const scriptId = crypto.randomUUID();

    // Create script
    db.query(`
      INSERT INTO scripts (
        id, title, slug, author, synopsis, cast_list, category_id,
        language, genre, performance_type, duration, cast_count,
        age_group, content, file_url, status, views, downloads,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, datetime('now'), datetime('now'))
    `).run(
      scriptId,
      title.trim(),
      finalSlug,
      author.trim(),
      synopsis.trim(),
      sub.cast_list,
      category_id,
      sub.language || "Bahasa Indonesia",
      sub.genre,
      sub.performance_type,
      sub.duration,
      sub.cast_count,
      sub.age_group,
      content,
      sub.file_url,
      publish_status === "Draft" ? "Draft" : "Terbit"
    );

    // If submission had tags string, link them
    if (sub.tags) {
      const tagNames = sub.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      for (const tName of tagNames) {
        const slug = tName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        let tag = db.query("SELECT id FROM tags WHERE slug = ?").get(slug) as any;
        if (!tag) {
          const newTagId = crypto.randomUUID();
          db.query("INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)").run(newTagId, tName, slug);
          tag = { id: newTagId };
        }
        db.query("INSERT OR IGNORE INTO script_tags (script_id, tag_id) VALUES (?, ?)").run(scriptId, tag.id);
      }
    }

    // Update submission record
    db.query(`
      UPDATE submissions SET
        status = 'Disetujui',
        admin_note = ?,
        reviewed_at = datetime('now'),
        reviewed_by = ?
      WHERE id = ?
    `).run(admin_note || "Naskah disetujui dan diterbitkan.", req.user?.id || null, id);

    logAudit("APPROVE_SUBMISSION", "submissions", id, { script_id: scriptId, publish_status }, req.user?.id, req.user?.name);

    res.json({
      success: true,
      message: `Naskah berhasil disetujui dan dijadikan status ${publish_status}.`,
      script_id: scriptId,
      slug: finalSlug
    });
  } catch (err: any) {
    console.error("Approve submission error:", err);
    res.status(500).json({ error: "Gagal menyetujui pengiriman naskah." });
  }
}

// 15. POST /api/admin/submissions/:id/reject
export function rejectAdminSubmission(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const { admin_note } = req.body;

    const sub = db.query("SELECT * FROM submissions WHERE id = ?").get(id) as any;
    if (!sub) {
      res.status(404).json({ error: "Data kiriman tidak ditemukan." });
      return;
    }

    db.query(`
      UPDATE submissions SET
        status = 'Ditolak',
        admin_note = ?,
        reviewed_at = datetime('now'),
        reviewed_by = ?
      WHERE id = ?
    `).run(admin_note || "Naskah belum memenuhi kriteria penerbitan.", req.user?.id || null, id);

    logAudit("REJECT_SUBMISSION", "submissions", id, { admin_note }, req.user?.id, req.user?.name);

    res.json({
      success: true,
      message: "Pengiriman naskah telah ditolak."
    });
  } catch (err: any) {
    console.error("Reject submission error:", err);
    res.status(500).json({ error: "Gagal menolak pengiriman naskah." });
  }
}

// 16. Categories CRUD
export function getAdminCategories(req: AuthRequest, res: Response): void {
  try {
    const categories = db.query(`
      SELECT 
        c.*,
        COUNT(s.id) as totalScripts,
        COUNT(CASE WHEN s.status = 'Terbit' THEN 1 END) as publishedScripts
      FROM categories c
      LEFT JOIN scripts s ON c.id = s.category_id AND s.status != 'Trash'
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memuat kategori." });
  }
}

export function saveAdminCategory(req: AuthRequest, res: Response): void {
  try {
    const { id, name, slug: customSlug, description, icon } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ error: "Nama kategori wajib diisi." });
      return;
    }

    const slug = (customSlug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    if (id) {
      db.query(`
        UPDATE categories SET
          name = ?, slug = ?, description = ?, icon = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(name.trim(), slug, description || null, icon || "BookOpen", id);
      logAudit("UPDATE_CATEGORY", "categories", id, { name, slug }, req.user?.id, req.user?.name);
      res.json({ success: true, message: "Kategori berhasil diperbarui." });
    } else {
      const newId = crypto.randomUUID();
      db.query(`
        INSERT INTO categories (id, name, slug, description, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).run(newId, name.trim(), slug, description || null, icon || "BookOpen");
      logAudit("CREATE_CATEGORY", "categories", newId, { name, slug }, req.user?.id, req.user?.name);
      res.status(201).json({ success: true, message: "Kategori berhasil ditambahkan." });
    }
  } catch (err: any) {
    console.error("Save category error:", err);
    res.status(500).json({ error: "Gagal menyimpan kategori. Pastikan slug unik." });
  }
}

export function deleteAdminCategory(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const scriptCount = (db.query("SELECT COUNT(*) as c FROM scripts WHERE category_id = ?").get(id) as any).c;
    if (scriptCount > 0) {
      res.status(400).json({ error: `Kategori tidak dapat dihapus karena masih digunakan oleh ${scriptCount} naskah.` });
      return;
    }

    db.query("DELETE FROM categories WHERE id = ?").run(id);
    logAudit("DELETE_CATEGORY", "categories", id, {}, req.user?.id, req.user?.name);
    res.json({ success: true, message: "Kategori berhasil dihapus." });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menghapus kategori." });
  }
}

// 17. Tags CRUD
export function getAdminTags(req: AuthRequest, res: Response): void {
  try {
    const tags = db.query(`
      SELECT t.*, COUNT(st.script_id) as scriptCount
      FROM tags t
      LEFT JOIN script_tags st ON t.id = st.tag_id
      GROUP BY t.id
      ORDER BY t.name ASC
    `).all();
    res.json(tags);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memuat tags." });
  }
}

export function saveAdminTag(req: AuthRequest, res: Response): void {
  try {
    const { id, name } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ error: "Nama tag wajib diisi." });
      return;
    }

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

    if (id) {
      db.query("UPDATE tags SET name = ?, slug = ? WHERE id = ?").run(name.trim(), slug, id);
      res.json({ success: true, message: "Tag berhasil diperbarui." });
    } else {
      const newId = crypto.randomUUID();
      db.query("INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)").run(newId, name.trim(), slug);
      res.status(201).json({ success: true, message: "Tag berhasil ditambahkan." });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menyimpan tag. Pastikan tag unik." });
  }
}

export function deleteAdminTag(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    db.query("DELETE FROM script_tags WHERE tag_id = ?").run(id);
    db.query("DELETE FROM tags WHERE id = ?").run(id);
    res.json({ success: true, message: "Tag berhasil dihapus." });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menghapus tag." });
  }
}

// 18. Reports Management
export function getAdminReports(req: AuthRequest, res: Response): void {
  try {
    const reports = db.query(`
      SELECT r.*, s.title as linked_script_title, s.slug as linked_script_slug, s.status as linked_script_status
      FROM reports r
      LEFT JOIN scripts s ON r.script_id = s.id
      ORDER BY r.created_at DESC
    `).all();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memuat laporan." });
  }
}

export function updateReportStatus(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    db.query(`
      UPDATE reports SET
        status = ?,
        admin_notes = ?,
        resolved_at = CASE WHEN ? IN ('Resolved', 'Dismissed') THEN datetime('now') ELSE resolved_at END
      WHERE id = ?
    `).run(status, admin_notes || null, status, id);

    logAudit("UPDATE_REPORT_STATUS", "reports", id, { status, admin_notes }, req.user?.id, req.user?.name);
    res.json({ success: true, message: "Status laporan berhasil diperbarui." });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui status laporan." });
  }
}

// Unpublish reported script directly (FR-028)
export function unpublishReportedScript(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params; // Report ID
    const report = db.query("SELECT * FROM reports WHERE id = ?").get(id) as any;
    if (!report || !report.script_id) {
      res.status(400).json({ error: "Laporan tidak terhubung ke naskah manapun." });
      return;
    }

    db.query("UPDATE scripts SET status = 'Draft', updated_at = datetime('now') WHERE id = ?").run(report.script_id);
    db.query("UPDATE reports SET status = 'Resolved', admin_notes = 'Naskah telah dinonaktifkan (status diubah ke Draft) karena laporan hak cipta.', resolved_at = datetime('now') WHERE id = ?").run(id);

    logAudit("UNPUBLISH_REPORTED_SCRIPT", "scripts", report.script_id, { report_id: id }, req.user?.id, req.user?.name);
    res.json({ success: true, message: "Naskah berhasil dinonaktifkan dari publikasi dan status laporan diselesaikan." });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menonaktifkan naskah." });
  }
}

// 19. GET /api/admin/audit-logs
export function getAdminAuditLogs(req: AuthRequest, res: Response): void {
  try {
    const logs = db.query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100").all();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memuat log aktivitas." });
  }
}

// 20. POST /api/admin/upload (General file/cover upload endpoint for Admin)
export function handleAdminUpload(req: AuthRequest, res: Response): void {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Tidak ada file yang diunggah." });
      return;
    }

    const isCover = req.file.fieldname === "cover" || req.file.fieldname === "cover_image";
    const fileUrl = isCover ? `/uploads/covers/${req.file.filename}` : `/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size
    });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengunggah file." });
  }
}

