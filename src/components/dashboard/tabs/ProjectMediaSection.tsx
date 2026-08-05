"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Upload, X, ImageIcon, AlertTriangle, Plus, Save, Trash2 } from "lucide-react";
import type { DProject } from "@/types/dashboard.types";
import { fileToBase64, validateFileSize } from "@/utils/file.utils";

interface ProjectMediaSectionProps {
  project: DProject;
  onProjectUpdated: (project: DProject) => void;
}

interface GalleryImage {
  id: string;
  projectId: string;
  assetId: string;
  sortOrder: number;
  asset: {
    id: string;
    name: string;
    usedIn: string;
    assetFile: { id: string; url: string } | null;
  } | null;
}

// ── Staged image slot (thumbnail or fullscreen) ────────────────────────────────

interface ImageSlotProps {
  label: string;
  currentUrl: string | null | undefined;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}

function ImageSlot({ label, currentUrl, isUploading, onUpload, onRemove }: ImageSlotProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when unmounted or when pending changes
  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLocalError(null);

    if (!validateFileSize(file, 2)) {
      setLocalError(`"${file.name}" exceeds the 2 MB limit.`);
      return;
    }

    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const discardPending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setLocalError(null);
  };

  const handleSave = async () => {
    if (!pendingFile) return;
    setSaving(true);
    setLocalError(null);
    try {
      await onUpload(pendingFile);
      // Clear pending on success
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      setPendingFile(null);
      setPendingPreview(null);
    } catch (err: any) {
      setLocalError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  // The image to render in the slot: pending local preview OR saved Cloudinary URL
  const displayUrl = pendingPreview ?? currentUrl;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</label>

      {/* Error */}
      {localError && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {localError}
        </div>
      )}

      {/* Image Preview Area */}
      <div className="relative aspect-video rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden flex items-center justify-center group/img">
        {(isUploading && !pendingPreview) ? (
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        ) : displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Pending badge */}
            {pendingPreview && !saving && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                Preview — unsaved
              </div>
            )}
            {saving && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
            {/* Hover overlay — only show full controls when not saving */}
            {!saving && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {pendingPreview ? (
                  // Pending state: show Save and Discard
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-semibold transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={discardPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Discard
                    </button>
                  </>
                ) : (
                  // Saved state: show Replace and Remove
                  <>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white backdrop-blur-sm transition-colors"
                      title="Replace image"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onRemove}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          // Empty state
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">Choose {label}</span>
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleFileSelect}
        />
      </div>

      {/* Action bar below when pending */}
      {pendingPreview && !saving && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Image
          </button>
          <button
            type="button"
            onClick={discardPending}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Discard
          </button>
          <span className="text-[11px] text-neutral-400 ml-1">
            {pendingFile?.name} — {((pendingFile?.size ?? 0) / 1024).toFixed(0)} KB
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ProjectMediaSection({ project, onProjectUpdated }: ProjectMediaSectionProps) {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // Per-slot uploading flags
  const [uploadingSlot, setUploadingSlot] = useState<Record<string, boolean>>({});

  // Gallery staged pending files
  const [pendingGallery, setPendingGallery] = useState<{ file: File; preview: string }[]>([]);
  const [savingGallery, setSavingGallery] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, [project.id]);

  // Clean up gallery pending previews on unmount
  useEffect(() => {
    return () => {
      pendingGallery.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);
      const res = await fetch(`/api/v1/projects/${project.id}/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGallery(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    } finally {
      setLoadingGallery(false);
    }
  };

  // ── Thumbnail / Fullscreen handlers ──────────────────────────────────────────

  const uploadSlotImage = async (
    file: File,
    type: "thumbnail" | "fullscreen"
  ): Promise<void> => {
    setError(null);
    setUploadingSlot((prev) => ({ ...prev, [type]: true }));

    try {
      const base64 = await fileToBase64(file);

      const assetRes = await fetch("/api/v1/assets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          folder: "images",
          name: `${project.slug}-${type}-${Date.now()}`,
          usedIn: `project-${type}`,
        }),
      });

      if (!assetRes.ok) {
        const errData = await assetRes.json();
        throw new Error(errData.error || "Upload failed");
      }

      const { data: assetData } = await assetRes.json();
      const newAssetId = assetData.assetId;

      // Link to project — PATCH now returns joined asset URLs
      const updateRes = await fetch(`/api/v1/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type === "thumbnail" ? "thumbnailAssetId" : "fullscreenAssetId"]: newAssetId,
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to update project");
      const { data: updatedProject } = await updateRes.json();
      onProjectUpdated(updatedProject);
    } finally {
      setUploadingSlot((prev) => ({ ...prev, [type]: false }));
    }
  };

  const removeSlotImage = async (type: "thumbnail" | "fullscreen") => {
    setError(null);
    const oldAssetId = type === "thumbnail" ? project.thumbnailAssetId : project.fullscreenAssetId;

    setUploadingSlot((prev) => ({ ...prev, [type]: true }));
    try {
      const updateRes = await fetch(`/api/v1/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type === "thumbnail" ? "thumbnailAssetId" : "fullscreenAssetId"]: null,
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to update project");
      const { data: updatedProject } = await updateRes.json();
      onProjectUpdated(updatedProject);

      // Clean up the old asset (cascade: asset → asset_file → Cloudinary)
      if (oldAssetId) {
        await fetch(`/api/v1/assets/${oldAssetId}`, { method: "DELETE" }).catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove image");
    } finally {
      setUploadingSlot((prev) => ({ ...prev, [type]: false }));
    }
  };

  // ── Gallery handlers ──────────────────────────────────────────────────────────

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    setError(null);
    const oversized = files.find((f) => f.size > 2 * 1024 * 1024);
    if (oversized) {
      setError(`"${oversized.name}" exceeds the 2 MB limit.`);
      return;
    }

    const newPending = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setPendingGallery((prev) => [...prev, ...newPending]);
  };

  const discardPendingGallery = (index: number) => {
    setPendingGallery((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const saveGallery = async () => {
    if (!pendingGallery.length) return;
    setError(null);
    setSavingGallery(true);

    try {
      for (const { file } of pendingGallery) {
        const base64 = await fileToBase64(file);

        const assetRes = await fetch("/api/v1/assets/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            folder: "images",
            name: `${project.slug}-gallery-${Date.now()}`,
            usedIn: "project-gallery",
          }),
        });

        if (!assetRes.ok) {
          const errData = await assetRes.json();
          throw new Error(errData.error || "Upload failed");
        }

        const { data: assetData } = await assetRes.json();

        const galRes = await fetch(`/api/v1/projects/${project.id}/gallery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId: assetData.assetId }),
        });

        if (galRes.ok) {
          const { data } = await galRes.json();
          setGallery((prev) => [...prev, data]);
        }
      }

      // Clear all pending after save
      pendingGallery.forEach((p) => URL.revokeObjectURL(p.preview));
      setPendingGallery([]);
    } catch (err: any) {
      setError(err.message || "Gallery upload failed");
    } finally {
      setSavingGallery(false);
    }
  };

  const removeGalleryImage = async (imageId: string, assetId: string) => {
    try {
      await fetch(`/api/v1/projects/${project.id}/gallery/${imageId}`, { method: "DELETE" });
      setGallery((prev) => prev.filter((img) => img.id !== imageId));
      await fetch(`/api/v1/assets/${assetId}`, { method: "DELETE" }).catch(() => {});
    } catch (err) {
      console.error("Failed to delete gallery image", err);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="group bg-white dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 rounded-2xl overflow-hidden shadow-sm shadow-neutral-900/[0.02] transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900/80 dark:to-neutral-900/40">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900/[0.04] dark:bg-white/[0.06] border border-neutral-900/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <ImageIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">Project Media</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5">Choose images locally then click Save to upload.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Global error */}
        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Thumbnail & Fullscreen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageSlot
            label="Thumbnail"
            currentUrl={project.thumbnailAsset?.assetFile?.url ?? null}
            isUploading={!!uploadingSlot.thumbnail}
            onUpload={(file) => uploadSlotImage(file, "thumbnail")}
            onRemove={() => removeSlotImage("thumbnail")}
          />
          <ImageSlot
            label="Fullscreen Cover"
            currentUrl={project.fullscreenAsset?.assetFile?.url ?? null}
            isUploading={!!uploadingSlot.fullscreen}
            onUpload={(file) => uploadSlotImage(file, "fullscreen")}
            onRemove={() => removeSlotImage("fullscreen")}
          />
        </div>

        {/* Gallery */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Gallery Images</label>
            <div className="flex items-center gap-2">
              {pendingGallery.length > 0 && (
                <button
                  type="button"
                  onClick={saveGallery}
                  disabled={savingGallery}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {savingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save {pendingGallery.length} image{pendingGallery.length !== 1 ? "s" : ""}
                </button>
              )}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={savingGallery}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Images
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={galleryInputRef}
                onChange={handleGalleryFileSelect}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Pending gallery previews */}
            {pendingGallery.map((p, idx) => (
              <div key={`pending-${idx}`} className="relative aspect-square rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500 overflow-hidden group/gal bg-neutral-50 dark:bg-neutral-900/50">
                <img src={p.preview} alt="Pending" className="w-full h-full object-cover opacity-75" />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                  Unsaved
                </div>
                <button
                  type="button"
                  onClick={() => discardPendingGallery(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Saved gallery images */}
            {loadingGallery ? (
              <div className="col-span-full py-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            ) : gallery.length === 0 && pendingGallery.length === 0 ? (
              <div className="col-span-full py-8 flex flex-col items-center justify-center text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-xs">No gallery images yet</span>
              </div>
            ) : (
              gallery.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden group/gal bg-neutral-50 dark:bg-neutral-900/50">
                  {img.asset?.assetFile?.url ? (
                    <img src={img.asset.assetFile.url} alt="Gallery" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-neutral-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(img.id, img.assetId)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
