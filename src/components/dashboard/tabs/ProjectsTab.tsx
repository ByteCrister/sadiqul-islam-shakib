"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Github } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import type { DProject } from "@/types/dashboard.types";
import { ProjectFormValues } from "@/utils/validations/project.validation";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import ProjectEditor from "./ProjectEditor";

export default function ProjectsTab() {
  const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useDashboardStore();
  
  const [view, setView] = useState<"list" | "edit">("list");
  const [editTarget, setEditTarget] = useState<DProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const isLoading = loading.projects;

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setEditTarget(null); setView("edit"); };
  const openEdit = (p: DProject) => { setEditTarget(p); setView("edit"); };
  const closeEditor = () => { setView("list"); setEditTarget(null); };

  const handleSubmit = async (data: ProjectFormValues) => {
    const payload = {
      ...data,
      tech: data.tech.split(",").map((s) => s.trim()).filter(Boolean),
      features: data.features ? data.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
      challenges: data.challenges ? data.challenges.split(",").map((s) => s.trim()).filter(Boolean) : [],
      learnings: data.learnings ? data.learnings.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    if (editTarget) {
      await updateProject(editTarget.id, payload);
      // Re-fetch so sort orders reflect server compaction
      await fetchProjects(true);
      const updated = useDashboardStore.getState().projects.find((p) => p.id === editTarget.id);
      if (updated) setEditTarget(updated);
    } else {
      await createProject(payload as any);
      // Re-fetch to get server-assigned compacted order
      await fetchProjects(true);
      const allProjects = useDashboardStore.getState().projects;
      // Find the newly created project (last by createdAt)
      const created = [...allProjects].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      if (created) {
        setEditTarget(created);
        // stay in edit view for media upload
      } else {
        closeEditor();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget);
    setDeleteTarget(null);
  };

  const sortedProjects = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  if (view === "edit") {
    return (
      <ProjectEditor
        defaultValues={editTarget ? {
          ...editTarget,
          tech: editTarget.tech?.join(", ") ?? "",
          features: editTarget.features?.join(", ") ?? "",
          challenges: editTarget.challenges?.join(", ") ?? "",
          learnings: editTarget.learnings?.join(", ") ?? "",
          liveUrl: editTarget.liveUrl ?? "",
          loginEmail: editTarget.loginEmail ?? "",
          loginPassword: editTarget.loginPassword ?? "",
          warningMessage: editTarget.warningMessage ?? "",
          timeline: editTarget.timeline ?? "",
        } : {
          sortOrder: projects.length,
          tech: "",
        } as any}
        editTarget={editTarget}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={closeEditor}
        onProjectUpdated={(updated) => {
          // Keep the editTarget in sync when media section updates the project
          setEditTarget(updated);
          useDashboardStore.getState().setProjects(
            useDashboardStore.getState().projects.map((p) => p.id === updated.id ? updated : p)
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Projects</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio</p>
        </div>
        <button
          id="add-project-btn"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {error.projects && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.projects}
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project to start showcasing your work."
          action={
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group hover:shadow-sm"
            >
              {/* Sort badge */}
              <span className="text-[11px] font-mono text-neutral-300 dark:text-neutral-700 w-4 text-center tabular-nums flex-shrink-0">{project.sortOrder}</span>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{project.title}</h4>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                    {project.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate mb-2">{project.description}</p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {project.tech?.slice(0, 4).map((t) => (
                    <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 font-medium">{t}</span>
                  ))}
                  {(project.tech?.length ?? 0) > 4 && (
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-600">+{(project.tech?.length ?? 0) - 4} more</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="Live site">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="GitHub">
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                <button
                  id={`edit-project-${project.id}`}
                  onClick={() => openEdit(project)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`delete-project-${project.id}`}
                  onClick={() => setDeleteTarget(project.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete project?"
        message="This will permanently remove the project. This cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
