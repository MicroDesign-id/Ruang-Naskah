import { Request, Response } from "express";
import { db } from "../db";
import crypto from "crypto";
import path from "path";
import fs from "fs";

// Helper to log audit
export function logAudit(action: string, entityType: string, entityId?: string, metadata?: any, userId?: string, userName?: string) {
  try {
    const id = crypto.randomUUID();
    db.query(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(id, userId || null, userName || "System / Guest", action, entityType, entityId || null, metadata ? JSON.stringify(metadata) : null);
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

// 1. GET /api/scripts (Public list with comprehensive multi-faceted filters)
export function getPublicScripts(req: Request, res: Response): void {
  try {
    const {
      q,
      category,
      language,
      genre,
      performance_type,
      cast_count,
      cast_range,
      duration,
      age_group,
      tag,
      sort = "newest",
      page = "1",
      limit = "12"
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = ["s.status = 'Terbit'"];
    const params: any[] = [];

    // Search keyword query across Title, Synopsis, Author, Cast, Language, Genre, Tags
    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      conditions.push(`(
        s.title LIKE ? OR
        s.author LIKE ? OR
        s.synopsis LIKE ? OR
        s.cast_list LIKE ? OR
        s.language LIKE ? OR
        s.genre LIKE ? OR
        c.name LIKE ? OR
        EXISTS (
          SELECT 1 FROM script_tags st
          JOIN tags t ON st.tag_id = t.id
          WHERE st.script_id = s.id AND t.name LIKE ?
        )
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter Category (by category ID or slug)
    if (category) {
      conditions.push("(s.category_id = ? OR c.slug = ?)");
      params.push(category, category);
    }

    // Filter Language
    if (language) {
      conditions.push("s.language = ?");
      params.push(language);
    }

    // Filter Genre
    if (genre) {
      conditions.push("s.genre LIKE ?");
      params.push(`%${genre}%`);
    }

    // Filter Performance Type
    if (performance_type) {
      conditions.push("s.performance_type = ?");
      params.push(performance_type);
    }

    // Filter Exact Cast Count
    if (cast_count && !isNaN(parseInt(cast_count, 10))) {
      conditions.push("s.cast_count = ?");
      params.push(parseInt(cast_count, 10));
    }

    // Filter Cast Range (e.g. '1', '2-5', '6-10', '10+')
    if (cast_range) {
      if (cast_range === "1") {
        conditions.push("s.cast_count = 1");
      } else if (cast_range === "2-5") {
        conditions.push("s.cast_count >= 2 AND s.cast_count <= 5");
      } else if (cast_range === "6-10") {
        conditions.push("s.cast_count >= 6 AND s.cast_count <= 10");
      } else if (cast_range === "10+") {
        conditions.push("s.cast_count > 10");
      }
    }

    // Filter Duration
    if (duration) {
      conditions.push("s.duration LIKE ?");
      params.push(`%${duration}%`);
    }

    // Filter Age Group
    if (age_group) {
      conditions.push("s.age_group LIKE ?");
      params.push(`%${age_group}%`);
    }

    // Filter Tag
    if (tag) {
      conditions.push(`EXISTS (
        SELECT 1 FROM script_tags st
        JOIN tags t ON st.tag_id = t.id
        WHERE st.script_id = s.id AND (t.slug = ? OR t.name = ?)
      )`);
      params.push(tag, tag);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sorting
    let orderBy = "s.created_at DESC";
    if (sort === "popular") {
      orderBy = "s.views DESC, s.downloads DESC";
    } else if (sort === "downloads") {
      orderBy = "s.downloads DESC";
    } else if (sort === "title_asc") {
      orderBy = "s.title ASC";
    } else if (sort === "oldest") {
      orderBy = "s.created_at ASC";
    }

    // Count total matching items
    const countSql = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereClause}
    `;
    const totalRow = db.query(countSql).get(...params) as { total: number };
    const total = totalRow ? totalRow.total : 0;

    // Fetch paginated data
    const querySql = `
      SELECT 
        s.id, s.title, s.slug, s.author, s.synopsis, s.category_id,
        s.language, s.genre, s.performance_type, s.duration, s.cast_count,
        s.age_group, s.cover_url, s.file_url, s.views, s.downloads, s.created_at,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const scripts = db.query(querySql).all(...params, limitNum, offset) as any[];

    // Attach tags to scripts
    const scriptIds = scripts.map(s => `'${s.id}'`).join(",");
    let tagsMap: Record<string, any[]> = {};
    if (scriptIds) {
      const tagsRows = db.query(`
        SELECT st.script_id, t.id, t.name, t.slug
        FROM script_tags st
        JOIN tags t ON st.tag_id = t.id
        WHERE st.script_id IN (${scriptIds})
      `).all() as any[];
      
      for (const row of tagsRows) {
        if (!tagsMap[row.script_id]) tagsMap[row.script_id] = [];
        tagsMap[row.script_id].push({ id: row.id, name: row.name, slug: row.slug });
      }
    }

    const formatted = scripts.map(s => ({
      ...s,
      category: {
        id: s.category_id,
        name: s.category_name,
        slug: s.category_slug,
        icon: s.category_icon
      },
      tags: tagsMap[s.id] || []
    }));

    res.json({
      scripts: formatted,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err: any) {
    console.error("Error in getPublicScripts:", err);
    res.status(500).json({ error: "Gagal memuat daftar naskah." });
  }
}

// 2. GET /api/scripts/:slug (Public Script Detail & View Increment)
export function getPublicScriptBySlug(req: Request, res: Response): void {
  try {
    const { slug } = req.params;
    const script = db.query(`
      SELECT 
        s.*,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.description as category_description
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.slug = ? AND s.status = 'Terbit'
    `).get(slug) as any;

    if (!script) {
      res.status(404).json({ error: "Naskah tidak ditemukan atau belum dipublikasikan." });
      return;
    }

    // Increment view counter (BR-024, SRS UC-02)
    db.query("UPDATE scripts SET views = views + 1 WHERE id = ?").run(script.id);
    script.views += 1;

    // Fetch tags
    const tags = db.query(`
      SELECT t.id, t.name, t.slug
      FROM script_tags st
      JOIN tags t ON st.tag_id = t.id
      WHERE st.script_id = ?
    `).all(script.id) as any[];

    // Fetch related scripts in same category
    const related = db.query(`
      SELECT s.id, s.title, s.slug, s.author, s.cover_url, s.views, s.downloads, c.name as category_name
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.category_id = ? AND s.id != ? AND s.status = 'Terbit'
      ORDER BY s.views DESC
      LIMIT 4
    `).all(script.category_id, script.id);

    // Parse cast list JSON if applicable
    let parsedCastList = null;
    if (script.cast_list) {
      try {
        parsedCastList = JSON.parse(script.cast_list);
      } catch {
        parsedCastList = script.cast_list;
      }
    }

    res.json({
      ...script,
      cast_list_parsed: parsedCastList,
      category: {
        id: script.category_id,
        name: script.category_name,
        slug: script.category_slug,
        icon: script.category_icon,
        description: script.category_description
      },
      tags,
      related
    });
  } catch (err: any) {
    console.error("Error in getPublicScriptBySlug:", err);
    res.status(500).json({ error: "Gagal memuat detail naskah." });
  }
}

// 3. GET /api/scripts/:id/download (Public Download & Download Increment)
export function downloadScriptFile(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const script = db.query("SELECT * FROM scripts WHERE id = ? OR slug = ?").get(id, id) as any;

    if (!script || script.status !== "Terbit") {
      res.status(404).json({ error: "Naskah tidak ditemukan." });
      return;
    }

    // Increment downloads counter
    db.query("UPDATE scripts SET downloads = downloads + 1 WHERE id = ?").run(script.id);
    logAudit("DOWNLOAD_SCRIPT", "scripts", script.id, { title: script.title });

    if (script.file_url) {
      // Clean path to prevent path traversal
      const safeFileName = path.basename(script.file_url);
      const filePath = path.resolve(process.cwd(), "uploads/documents", safeFileName);
      
      if (fs.existsSync(filePath)) {
        res.download(filePath, `${script.slug}${path.extname(safeFileName)}`);
        return;
      }
    }

    // If no physical file, generate text-based formatted document download on the fly
    const content = `RUANG NASKAH DRAMA
==================================================
Judul       : ${script.title}
Penulis     : ${script.author}
Bahasa      : ${script.language}
Genre       : ${script.genre || "-"}
Pemain      : ${script.cast_count || "-"} orang
Durasi      : ${script.duration || "-"}
==================================================

SINOPSIS:
${script.synopsis}

DAFTAR TOKOH:
${script.cast_list || "-"}

ISI NASKAH:
${script.content || "(Isi naskah lengkap belum tersedia dalam bentuk teks)"}

==================================================
Diunduh dari Ruang Naskah Drama — Perpustakaan Digital Naskah
`;
    res.setHeader("Content-Disposition", `attachment; filename="${script.slug}.txt"`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(content);
  } catch (err: any) {
    console.error("Error in downloadScriptFile:", err);
    res.status(500).json({ error: "Gagal mengunduh file naskah." });
  }
}

// 4. GET /api/categories (Public categories with script count)
export function getPublicCategories(req: Request, res: Response): void {
  try {
    const categories = db.query(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.icon,
        COUNT(CASE WHEN s.status = 'Terbit' THEN 1 END) as scriptCount
      FROM categories c
      LEFT JOIN scripts s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json(categories);
  } catch (err: any) {
    console.error("Error in getPublicCategories:", err);
    res.status(500).json({ error: "Gagal memuat kategori." });
  }
}

// 5. GET /api/tags (Public tags list)
export function getPublicTags(req: Request, res: Response): void {
  try {
    const tags = db.query(`
      SELECT t.id, t.name, t.slug, COUNT(st.script_id) as scriptCount
      FROM tags t
      LEFT JOIN script_tags st ON t.id = st.tag_id
      LEFT JOIN scripts s ON st.script_id = s.id AND s.status = 'Terbit'
      GROUP BY t.id
      ORDER BY scriptCount DESC, t.name ASC
    `).all();

    res.json(tags);
  } catch (err: any) {
    console.error("Error in getPublicTags:", err);
    res.status(500).json({ error: "Gagal memuat tags." });
  }
}

// 6. GET /api/featured (Home page featured recent & popular scripts)
export function getFeaturedScripts(req: Request, res: Response): void {
  try {
    const recent = db.query(`
      SELECT 
        s.id, s.title, s.slug, s.author, s.synopsis, s.language, s.cast_count, s.cover_url, s.views, s.downloads, s.created_at,
        c.name as category_name, c.slug as category_slug
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.status = 'Terbit'
      ORDER BY s.created_at DESC
      LIMIT 6
    `).all() as any[];

    const popular = db.query(`
      SELECT 
        s.id, s.title, s.slug, s.author, s.synopsis, s.language, s.cast_count, s.cover_url, s.views, s.downloads, s.created_at,
        c.name as category_name, c.slug as category_slug
      FROM scripts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.status = 'Terbit'
      ORDER BY s.views DESC, s.downloads DESC
      LIMIT 6
    `).all() as any[];

    const formattedRecent = recent.map(s => ({
      ...s,
      category: { name: s.category_name, slug: s.category_slug }
    }));

    const formattedPopular = popular.map(s => ({
      ...s,
      category: { name: s.category_name, slug: s.category_slug }
    }));

    res.json({ recent: formattedRecent, popular: formattedPopular });
  } catch (err: any) {
    console.error("Error in getFeaturedScripts:", err);
    res.status(500).json({ error: "Gagal memuat koleksi unggulan." });
  }
}

// 7. POST /api/submissions (Public script submission - No login required)
export function submitPublicScript(req: Request, res: Response): void {
  try {
    const {
      contributor_name,
      email,
      institution,
      title,
      author,
      category_id,
      language,
      genre,
      performance_type,
      duration,
      cast_count,
      age_group,
      synopsis,
      cast_list,
      tags,
      content,
      copyright_agreed
    } = req.body;

    // Strict Validations per PRD & SRS (BR-002, BR-003, BR-008, FR-011, FR-027)
    if (!contributor_name || !contributor_name.trim()) {
      res.status(400).json({ error: "Nama pengirim wajib diisi." });
      return;
    }

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: "Alamat email pengirim tidak valid." });
      return;
    }

    if (!title || !title.trim()) {
      res.status(400).json({ error: "Judul naskah wajib diisi." });
      return;
    }

    if (!author || !author.trim()) {
      res.status(400).json({ error: "Nama penulis naskah wajib diisi." });
      return;
    }

    if (!category_id) {
      res.status(400).json({ error: "Kategori naskah wajib dipilih." });
      return;
    }

    if (!synopsis || !synopsis.trim()) {
      res.status(400).json({ error: "Sinopsis naskah wajib diisi." });
      return;
    }

    if (copyright_agreed !== true && copyright_agreed !== "true" && copyright_agreed !== 1 && copyright_agreed !== "1") {
      res.status(400).json({ error: "Anda harus menyetujui pernyataan hak publikasi dan keaslian naskah." });
      return;
    }

    let fileUrl = "";
    if (req.file) {
      fileUrl = `/uploads/documents/${req.file.filename}`;
    }

    const submissionId = crypto.randomUUID();
    const castCountNum = cast_count ? parseInt(cast_count, 10) || null : null;

    db.query(`
      INSERT INTO submissions (
        id, contributor_name, email, institution, title, author,
        category_id, language, genre, performance_type, duration,
        cast_count, age_group, synopsis, cast_list, tags, content,
        file_url, status, admin_note, copyright_agreed, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, 1, datetime('now'))
    `).run(
      submissionId,
      contributor_name.trim(),
      email.trim(),
      institution ? institution.trim() : null,
      title.trim(),
      author.trim(),
      category_id,
      language ? language.trim() : "Bahasa Indonesia",
      genre ? genre.trim() : null,
      performance_type ? performance_type.trim() : null,
      duration ? duration.trim() : null,
      castCountNum,
      age_group ? age_group.trim() : null,
      synopsis.trim(),
      cast_list ? (typeof cast_list === "string" ? cast_list.trim() : JSON.stringify(cast_list)) : null,
      tags ? tags.trim() : null,
      content ? content.trim() : null,
      fileUrl || null
    );

    logAudit("SUBMIT_SCRIPT", "submissions", submissionId, {
      title,
      contributor: contributor_name,
      email
    });

    res.status(201).json({
      success: true,
      message: "Naskah Anda berhasil dikirimkan! Naskah akan ditinjau oleh tim kurator kami sebelum dipublikasikan.",
      submission_id: submissionId
    });
  } catch (err: any) {
    console.error("Error in submitPublicScript:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat mengirim naskah." });
  }
}

// 8. POST /api/reports (Public copyright report or contact inquiry)
export function submitReport(req: Request, res: Response): void {
  try {
    const {
      report_type = "copyright",
      script_id,
      script_title,
      reporter_name,
      reporter_email,
      description,
      proof_url
    } = req.body;

    if (!reporter_name || !reporter_name.trim()) {
      res.status(400).json({ error: "Nama pelapor / pengirim wajib diisi." });
      return;
    }

    if (!reporter_email || !reporter_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporter_email.trim())) {
      res.status(400).json({ error: "Alamat email pelapor tidak valid." });
      return;
    }

    if (!description || !description.trim()) {
      res.status(400).json({ error: "Uraian laporan atau pesan wajib diisi." });
      return;
    }

    const reportId = crypto.randomUUID();
    db.query(`
      INSERT INTO reports (
        id, report_type, script_id, script_title, reporter_name,
        reporter_email, description, proof_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open', datetime('now'))
    `).run(
      reportId,
      report_type,
      script_id || null,
      script_title || null,
      reporter_name.trim(),
      reporter_email.trim(),
      description.trim(),
      proof_url || null
    );

    logAudit("SUBMIT_REPORT", "reports", reportId, {
      type: report_type,
      reporter: reporter_name,
      script_id
    });

    res.status(201).json({
      success: true,
      message: "Laporan atau pesan Anda telah kami terima. Tim admin akan segera menindaklanjutinya.",
      report_id: reportId
    });
  } catch (err: any) {
    console.error("Error in submitReport:", err);
    res.status(500).json({ error: "Gagal mengirimkan laporan." });
  }
}

