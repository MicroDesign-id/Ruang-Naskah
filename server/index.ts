import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { db } from "./db";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static uploads serving
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// API routes mounting
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// SEO: Sitemap XML (FR-026, Section 13)
app.get("/sitemap.xml", (req, res) => {
  try {
    const scripts = db.query("SELECT slug, updated_at FROM scripts WHERE status = 'Terbit'").all() as any[];
    const categories = db.query("SELECT slug FROM categories").all() as any[];

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static public routes
    const staticRoutes = ["", "/naskah", "/kirim-naskah", "/tentang", "/kebijakan-hak-cipta", "/hubungi-admin"];
    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Categories
    for (const cat of categories) {
      xml += `  <url>\n    <loc>${baseUrl}/naskah?category=${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Scripts
    for (const s of scripts) {
      const lastmod = s.updated_at ? new Date(s.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      xml += `  <url>\n    <loc>${baseUrl}/naskah/${s.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

// SEO: Robots.txt
app.get("/robots.txt", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain");
  res.send(robots);
});

// Serve frontend in production
const distDir = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
      res.sendFile(path.join(distDir, "index.html"));
    }
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Terjadi kesalahan pada sistem."
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Ruang Naskah Drama running on http://localhost:${PORT}`);
});

