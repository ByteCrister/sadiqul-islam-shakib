"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2, Upload, Trash2, CheckCircle2, ImageIcon,
  FileText, AlertTriangle, User, Star, Pencil, X, Save
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import type { DProfileImage, DResume } from "@/types/dashboard.types";
import { fileToBase64, validateFileSize } from "@/utils/file.utils";
import ConfirmDialog from "../shared/ConfirmDialog";

// ── Inline Label Edit ──────────────────────────────────────────────────────────

function InlineEdit({
  value,
  onSave,
  isLoading,
}: {
  value: string;
  onSave: (val: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = async () => {
    if (draft.trim() && draft.trim() !== value) await onSave(draft.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          className="flex-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400/30"
        />
        <button onClick={handleSave} disabled={isLoading} className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 disabled:opacity-50">
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="p-1 text-neutral-400 hover:text-neutral-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group/label min-w-0">
      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{value}</span>
      <button onClick={() => { setDraft(value); setEditing(true); }} className="opacity-0 group-hover/label:opacity-100 transition-opacity p-0.5 text-neutral-400 hover:text-neutral-600">
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Profile Images Section ─────────────────────────────────────────────────────

function ProfileImagesSection() {
  const {
    profileImages, loading, error,
    fetchProfileImages, createProfileImage, updateProfileImage, deleteProfileImage,
  } = useDashboardStore();

  // Staged upload state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProfileImages(); }, []);

  const isLoading = loading.profileImages;

  // Step 1: user picks a file → validate & show local preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!validateFileSize(file, 2)) {
      setUploadError(`"${file.name}" exceeds the 2 MB limit.`);
      return;
    }

    // Local preview (doesn't hit network)
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setPendingLabel(file.name.replace(/\.[^.]+$/, ""));
  };

  // Discard the staged preview
  const discardPending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setPendingLabel("");
    setUploadError(null);
  };

  // Step 2: user clicks Save → actually upload
  const handleSave = async () => {
    if (!pendingFile) return;

    setUploadError(null);
    setSaving(true);
    try {
      const base64 = await fileToBase64(pendingFile);

      const assetRes = await fetch("/api/v1/assets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          folder: "images",
          name: `profile-${Date.now()}`,
          usedIn: "profile",
        }),
      });

      if (!assetRes.ok) {
        const err = await assetRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const { data: assetData } = await assetRes.json();

      await createProfileImage({
        assetId: assetData.assetId,
        label: pendingLabel.trim() || "Profile Photo",
      });

      discardPending();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (img: DProfileImage) => {
    if (img.isActive) return;
    await updateProfileImage(img.id, { isActive: true });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProfileImage(deleteTarget);
    setDeleteTarget(null);
  };

  const sorted = [...profileImages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Profile Photos</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {profileImages.length} photo{profileImages.length !== 1 ? "s" : ""} &mdash; one active at a time
            </p>
          </div>
        </div>
        {!pendingPreview && (
          <button
            id="select-profile-image-btn"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 disabled:opacity-50 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" /> Choose Photo
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Error */}
      {(uploadError || error.profileImages) && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{uploadError || error.profileImages}</p>
        </div>
      )}

      {/* ── Staged Preview Card ── */}
      {pendingPreview && (
        <div className="flex items-start gap-4 p-4 bg-blue-50/60 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/25 rounded-2xl">
          {/* Preview */}
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-500/30 flex-shrink-0 bg-white dark:bg-neutral-900">
            <img src={pendingPreview} alt="Preview" className="w-full h-full object-cover" />
          </div>

          {/* Label + actions */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                Label
              </label>
              <input
                value={pendingLabel}
                onChange={(e) => setPendingLabel(e.target.value)}
                placeholder="e.g. Professional Photo 2026"
                className="mt-1 w-full text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              {pendingFile?.name} &mdash; {((pendingFile?.size ?? 0) / 1024).toFixed(1)} KB
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                id="save-profile-image-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save Photo"}
              </button>
              <button
                onClick={discardPending}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Grid */}
      {isLoading && profileImages.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm">Loading photos…</p>
        </div>
      ) : profileImages.length === 0 && !pendingPreview ? (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400">
          <ImageIcon className="w-8 h-8 opacity-40" />
          <p className="text-sm font-medium">No photos yet</p>
          <p className="text-xs text-center max-w-[220px]">Upload a profile photo to use across your portfolio.</p>
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sorted.map((img) => {
            const url = img.asset?.assetFile?.url;
            return (
              <div
                key={img.id}
                className={`relative rounded-2xl border overflow-hidden transition-all group/card ${
                  img.isActive
                    ? "border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400/20 dark:ring-emerald-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  {url ? (
                    <img src={url} alt={img.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                    </div>
                  )}
                </div>

                {img.isActive && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow">
                    <Star className="w-2.5 h-2.5" fill="currentColor" /> Active
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  {!img.isActive && (
                    <button
                      id={`set-active-profile-image-${img.id}`}
                      onClick={() => handleSetActive(img)}
                      disabled={isLoading}
                      className="w-full py-1.5 text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-60"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    id={`delete-profile-image-${img.id}`}
                    onClick={() => setDeleteTarget(img.id)}
                    disabled={isLoading}
                    className="w-full py-1.5 text-[11px] font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>

                <div className="px-3 py-2 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <InlineEdit
                    value={img.label}
                    isLoading={isLoading}
                    onSave={(val) => updateProfileImage(img.id, { label: val })}
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(img.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete photo?"
        message="This photo will be permanently removed from your portfolio and Cloudinary."
        isLoading={isLoading}
      />
    </div>
  );
}

// ── Resumes Section ────────────────────────────────────────────────────────────

function ResumesSection() {
  const {
    resumes, loading, error,
    fetchResumes, createResume, updateResume, deleteResume,
  } = useDashboardStore();

  // Staged upload state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchResumes(); }, []);

  const isLoading = loading.resumes;

  // Step 1: user picks file → validate & stage it
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!validateFileSize(file, 2)) {
      setUploadError(`"${file.name}" exceeds the 2 MB limit.`);
      return;
    }

    setPendingFile(file);
    setPendingLabel(file.name.replace(/\.pdf$/i, ""));
  };

  const discardPending = () => {
    setPendingFile(null);
    setPendingLabel("");
    setUploadError(null);
  };

  // Step 2: user clicks Save → actually upload
  const handleSave = async () => {
    if (!pendingFile) return;

    setUploadError(null);
    setSaving(true);
    try {
      const base64 = await fileToBase64(pendingFile);

      const assetRes = await fetch("/api/v1/assets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          folder: "pdfs",
          name: `resume-${Date.now()}`,
          usedIn: "resume",
          resourceType: "raw",
        }),
      });

      if (!assetRes.ok) {
        const err = await assetRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const { data: assetData } = await assetRes.json();

      await createResume({
        assetId: assetData.assetId,
        label: pendingLabel.trim() || "Resume",
      });

      discardPending();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (r: DResume) => {
    if (r.isActive) return;
    await updateResume(r.id, { isActive: true });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteResume(deleteTarget);
    setDeleteTarget(null);
  };

  const sorted = [...resumes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Resumes</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} &mdash; active one shown to visitors
            </p>
          </div>
        </div>
        {!pendingFile && (
          <button
            id="select-resume-btn"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 disabled:opacity-50 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" /> Choose PDF
          </button>
        )}
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Error */}
      {(uploadError || error.resumes) && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{uploadError || error.resumes}</p>
        </div>
      )}

      {/* ── Staged Preview Card ── */}
      {pendingFile && (
        <div className="flex items-start gap-4 p-4 bg-amber-50/60 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/25 rounded-2xl">
          {/* PDF Icon placeholder */}
          <div className="w-16 h-20 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center gap-1 flex-shrink-0">
            <FileText className="w-6 h-6 text-amber-500" />
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">PDF</span>
          </div>

          {/* Label + actions */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                Label
              </label>
              <input
                value={pendingLabel}
                onChange={(e) => setPendingLabel(e.target.value)}
                placeholder="e.g. Resume 2026 – Full Stack"
                className="mt-1 w-full text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              {pendingFile.name} &mdash; {(pendingFile.size / 1024).toFixed(1)} KB
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                id="save-resume-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save Resume"}
              </button>
              <button
                onClick={discardPending}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded List */}
      {isLoading && resumes.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-3 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm">Loading resumes…</p>
        </div>
      ) : resumes.length === 0 && !pendingFile ? (
        <div className="py-12 flex flex-col items-center gap-3 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400">
          <FileText className="w-8 h-8 opacity-40" />
          <p className="text-sm font-medium">No resumes yet</p>
          <p className="text-xs text-center max-w-[220px]">Upload your PDF. Visitors download the active one.</p>
        </div>
      ) : sorted.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {sorted.map((r) => {
            const url = r.asset?.assetFile?.url;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all group/row ${
                  r.isActive
                    ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 ring-2 ring-emerald-400/10 dark:ring-emerald-500/10"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl border flex-shrink-0 ${
                  r.isActive
                    ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30"
                    : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                }`}>
                  <FileText className={`w-5 h-5 ${r.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500 dark:text-neutral-400"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <InlineEdit value={r.label} isLoading={isLoading} onSave={(val) => updateResume(r.id, { label: val })} />
                  <p className="text-[11px] text-neutral-400 mt-0.5">Uploaded {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>

                {r.isActive && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded-full flex-shrink-0">
                    <Star className="w-2.5 h-2.5" fill="currentColor" /> Active
                  </span>
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                  {url && (
                    <a
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View PDF"
                      className="p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {!r.isActive && (
                    <button id={`set-active-resume-${r.id}`} onClick={() => handleSetActive(r)} disabled={isLoading}
                      title="Set as active"
                      className="p-1.5 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button id={`delete-resume-${r.id}`} onClick={() => setDeleteTarget(r.id)} disabled={isLoading}
                    title="Delete"
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete resume?"
        message="This resume will be permanently removed from your portfolio and Cloudinary."
        isLoading={isLoading}
      />
    </div>
  );
}

// ── Main ProfileTab ────────────────────────────────────────────────────────────

export default function ProfileTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/[0.04] dark:bg-white/[0.06] border border-neutral-900/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Profile Settings</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your profile photos and resume files</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl shadow-sm shadow-neutral-900/[0.02]">
        <ProfileImagesSection />
      </div>

      <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

      <div className="p-6 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl shadow-sm shadow-neutral-900/[0.02]">
        <ResumesSection />
      </div>
    </div>
  );
}