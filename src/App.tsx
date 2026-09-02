import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import { PublicLayout } from "./components/PublicLayout";
import { Home } from "./pages/Home";
import { ScriptsList } from "./pages/ScriptsList";
import { ScriptDetail } from "./pages/ScriptDetail";
import { SubmitScript } from "./pages/SubmitScript";
import { About } from "./pages/About";
import { CopyrightPolicy } from "./pages/CopyrightPolicy";
import { ContactReport } from "./pages/ContactReport";

// Admin Pages
import { Login } from "./pages/admin/Login";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { ScriptsManager } from "./pages/admin/ScriptsManager";
import { ScriptEditor } from "./pages/admin/ScriptEditor";
import { SubmissionsManager } from "./pages/admin/SubmissionsManager";
import { SubmissionReview } from "./pages/admin/SubmissionReview";
import { CategoriesManager } from "./pages/admin/CategoriesManager";
import { TagsManager } from "./pages/admin/TagsManager";
import { ReportsManager } from "./pages/admin/ReportsManager";
import { AuditLogs } from "./pages/admin/AuditLogs";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portal Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/naskah" element={<ScriptsList />} />
            <Route path="/naskah/:slug" element={<ScriptDetail />} />
            <Route path="/kirim-naskah" element={<SubmitScript />} />
            <Route path="/tentang" element={<About />} />
            <Route path="/kebijakan-hak-cipta" element={<CopyrightPolicy />} />
            <Route path="/hubungi-admin" element={<ContactReport />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Panel Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="naskah" element={<ScriptsManager />} />
            <Route path="naskah/tambah" element={<ScriptEditor />} />
            <Route path="naskah/edit/:id" element={<ScriptEditor />} />
            <Route path="submissions" element={<SubmissionsManager />} />
            <Route path="submissions/:id" element={<SubmissionReview />} />
            <Route path="kategori" element={<CategoriesManager />} />
            <Route path="tags" element={<TagsManager />} />
            <Route path="laporan" element={<ReportsManager />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

