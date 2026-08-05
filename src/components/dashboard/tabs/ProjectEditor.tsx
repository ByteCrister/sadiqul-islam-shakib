"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft, Loader2, Save, Github, Globe, BookOpen,
  Code2, Layers, Calendar, AlignLeft, Zap, AlertTriangle, Lock, ImageIcon, Hash
} from "lucide-react";
import { projectSchema, ProjectFormValues } from "@/utils/validations/project.validation";
import type { DProject } from "@/types/dashboard.types";
import ProjectMediaSection from "./ProjectMediaSection";

interface ProjectEditorProps {
  defaultValues?: Partial<ProjectFormValues>;
  editTarget?: DProject | null;
  isLoading: boolean;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  onBack: () => void;
  onProjectUpdated?: (project: DProject) => void;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  desc,
  children,
}: {
  title: string;
  icon: React.ElementType;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group bg-white dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 rounded-2xl overflow-hidden shadow-sm shadow-neutral-900/[0.02] transition-colors">
      <div className="flex items-start gap-3 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900/80 dark:to-neutral-900/40">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900/[0.04] dark:bg-white/[0.06] border border-neutral-900/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">{title}</h3>
          {desc && <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, hint, required, error, children }: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="form-label flex items-baseline gap-1.5">
        <span>{label}</span>
        {required && <span className="text-red-500 leading-none">*</span>}
        {hint && <span className="text-neutral-400 dark:text-neutral-600 font-normal normal-case text-xs">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="form-error flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export default function ProjectEditor({ defaultValues, editTarget, isLoading, onSubmit, onBack, onProjectUpdated }: ProjectEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? { tech: "" as any },
  });

  const isEdit = !!editTarget;
  const canSubmit = !isLoading && (isDirty || !isEdit);

  return (
    <div className="space-y-6 pb-24 xl:pb-0">
      {/* Top bar */}
      <div className="sticky top-0 z-10 -mx-1 px-1 pb-1 xl:static xl:mx-0 xl:px-0 xl:pb-0">
        <div className="flex items-center justify-between gap-4 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/70 xl:bg-transparent xl:backdrop-blur-none rounded-2xl py-2 xl:py-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all active:scale-[0.97] flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
                  {isEdit ? editTarget?.title : "New Project"}
                </h2>
                {isEdit && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
                    Editing
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-500 mt-0.5 truncate">
                {isEdit ? "Update the details below and save." : "Fill in the details to add a new project."}
              </p>
            </div>
          </div>

          <button
            id="project-form-submit"
            form="project-editor-form"
            type="submit"
            disabled={!canSubmit}
            className="hidden sm:flex flex-shrink-0 items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? "Saving…" : "Save Project"}
          </button>
        </div>
      </div>

      <form id="project-editor-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Info */}
            <Section title="Basic Information" icon={AlignLeft}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Title" required error={errors.title?.message}>
                  <input {...register("title")} placeholder="My Awesome Project" className="form-input" />
                </Field>
                <Field label="Slug" required hint="lowercase, hyphens only" error={errors.slug?.message}>
                  <input {...register("slug")} placeholder="my-awesome-project" className="form-input font-mono" />
                </Field>
              </div>
              <Field label="Description" required hint="min. 10 characters" error={errors.description?.message}>
                <textarea {...register("description")} rows={4} placeholder="A full-stack web app for managing..." className="form-input resize-y" />
              </Field>
            </Section>

            {/* Tech & Category */}
            <Section title="Tech Stack & Category" icon={Code2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Tech Stack" required hint="comma separated" error={errors.tech?.message as string}>
                  <input {...register("tech" as any)} placeholder="React, Next.js, TypeScript" className="form-input" />
                </Field>
                <Field label="Category" required error={errors.category?.message}>
                  <input {...register("category")} placeholder="Full Stack, Frontend, Mobile…" className="form-input" />
                </Field>
              </div>
            </Section>

            {/* Links */}
            <Section title="Project Links" icon={Globe}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="GitHub URL" required error={errors.githubUrl?.message}>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input {...register("githubUrl")} placeholder="https://github.com/..." className="form-input pl-10" />
                  </div>
                </Field>
                <Field label="Live URL" hint="optional" error={errors.liveUrl?.message}>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input {...register("liveUrl")} placeholder="https://yourproject.com" className="form-input pl-10" />
                  </div>
                </Field>
              </div>
            </Section>

            {/* Details */}
            <Section title="Project Details" icon={BookOpen} desc="Helps visitors understand what you built and why">
              <Field label="Features" hint="comma separated, optional">
                <input {...register("features" as any)} placeholder="Auth, Dashboard, Dark mode, Real-time updates…" className="form-input" />
              </Field>
              <Field label="Challenges" hint="comma separated, optional">
                <input {...register("challenges" as any)} placeholder="Scaling, Performance, State management…" className="form-input" />
              </Field>
              <Field label="Learnings" hint="comma separated, optional">
                <input {...register("learnings" as any)} placeholder="Drizzle ORM, Streaming, Edge functions…" className="form-input" />
              </Field>
            </Section>

          </div>

          {/* ── Right column (1/3) ── */}
          <div className="space-y-6">

            {/* Meta */}
            <Section title="Meta" icon={Layers}>
              <Field label="Timeline" hint="optional">
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input {...register("timeline")} placeholder="Jan 2024 – Mar 2024" className="form-input pl-10" />
                </div>
              </Field>
              <Field label="Sort Order">
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    {...register("sortOrder", { valueAsNumber: true })}
                    type="number" min={0}
                    className="form-input pl-10 w-full"
                  />
                </div>
              </Field>
            </Section>

            {/* Demo Credentials */}
            <Section title="Demo Credentials" icon={Lock} desc="Shown as test login info on the live project page">
              <Field label="Demo Email" hint="optional">
                <input {...register("loginEmail")} type="email" placeholder="demo@example.com" className="form-input" />
              </Field>
              <Field label="Demo Password" hint="optional">
                <input {...register("loginPassword")} placeholder="demo-password" className="form-input" />
              </Field>
            </Section>

            {/* Warning */}
            <Section title="Warning Banner" icon={AlertTriangle} desc="Shown as an alert on the live demo page">
              <Field label="Warning Message" hint="optional">
                <textarea
                  {...register("warningMessage")}
                  rows={3}
                  placeholder="Read-only mode — no real data is stored."
                  className="form-input resize-none"
                />
              </Field>
            </Section>

            {/* Images */}
            {isEdit && editTarget ? (
              <ProjectMediaSection
                project={editTarget}
                onProjectUpdated={(p) => {
                  if (onProjectUpdated) onProjectUpdated(p);
                }}
              />
            ) : (
              <Section title="Project Media" icon={ImageIcon}>
                <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <ImageIcon className="w-6 h-6 mb-2 opacity-50 text-neutral-400" />
                  <p className="text-sm">Please save the project first to upload media.</p>
                </div>
              </Section>
            )}

          </div>
        </div>
      </form>

      {/* Mobile sticky save bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white/95 dark:bg-neutral-950/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-xl active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          form="project-editor-form"
          type="submit"
          disabled={!canSubmit}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isLoading ? "Saving…" : "Save Project"}
        </button>
      </div>
    </div>
  );
}