"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Calendar, MapPin } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import { experienceSchema, ExperienceFormValues } from "@/utils/validations/experience.validation";
import { ICON_PLATFORMS } from "@/utils/validations/shared.validation";
import type { DExperience } from "@/types/dashboard.types";
import FormModal from "../shared/FormModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import IconPicker from "../shared/IconPicker";

function ExperienceForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<ExperienceFormValues>;
  onSubmit: (data: ExperienceFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues ?? { iconPlatform: "lucide", sortOrder: 0, points: "" as any },
  });

  const iconPlatform = watch("iconPlatform");
  const iconName = watch("iconName");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Role *</label>
          <input {...register("role")} placeholder="Senior Developer" className="form-input" />
          {errors.role && <p className="form-error">{errors.role.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Organization</label>
          <input {...register("org")} placeholder="Tech Corp" className="form-input" />
          {errors.org && <p className="form-error">{errors.org.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Period *</label>
          <input {...register("period")} placeholder="2022 – Present" className="form-input" />
          {errors.period && <p className="form-error">{errors.period.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Sort Order</label>
          <input {...register("sortOrder", { valueAsNumber: true })} type="number" min={0} className="form-input" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="form-label">Description *</label>
        <textarea {...register("description")} rows={2} placeholder="Brief summary of your responsibilities..." className="form-input resize-none" />
        {errors.description && <p className="form-error">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="form-label">Bullet Points <span className="text-neutral-400 dark:text-neutral-600 normal-case font-normal">(comma separated)</span></label>
        <textarea {...register("points" as any)} rows={4} placeholder={"Led a team of 5 engineers..., Reduced load time by 40%..."} className="form-input resize-y" />
        {errors.points && <p className="form-error">{errors.points.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Icon Platform *</label>
          <select {...register("iconPlatform")} className="form-input">
            {ICON_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.iconPlatform && <p className="form-error">{errors.iconPlatform.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Icon Name *</label>
          <IconPicker
            value={iconName || ""}
            onChange={(val) => setValue("iconName", val, { shouldValidate: true, shouldDirty: true })}
            platform={iconPlatform || "lucide"}
            placeholder="Briefcase, Code..."
          />
          {errors.iconName && <p className="form-error">{errors.iconName.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          id="exp-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Experience
        </button>
      </div>
    </form>
  );
}

export default function ExperienceTab() {
  const { experiences, loading, error, fetchExperiences, createExperience, updateExperience, deleteExperience } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DExperience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const isLoading = loading.experiences;

  useEffect(() => { fetchExperiences(); }, []);

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (data: ExperienceFormValues) => {
    const payload = {
      ...data,
      points: (data.points || "").split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editTarget) {
      await updateExperience(editTarget.id, payload as any);
    } else {
      await createExperience(payload as any);
    }
    closeModal();
  };

  const sortedExperiences = [...experiences].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Experience</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{experiences.length} experience{experiences.length !== 1 ? "s" : ""} on your timeline</p>
        </div>
        <button
          id="add-exp-btn"
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {error.experiences && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.experiences}
        </div>
      )}

      {isLoading && experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading experiences…</p>
        </div>
      ) : experiences.length === 0 ? (
        <EmptyState title="No experience yet" description="Add your work history or education timeline entries." />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          <div className="space-y-4">
            {sortedExperiences.map((exp) => (
              <div key={exp.id} className="relative flex gap-6 group">
                {/* Timeline dot */}
                <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/50 items-center justify-center z-10 mt-0.5 shadow-sm">
                  <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-500">{exp.sortOrder}</span>
                </div>

                {/* Card */}
                <div className="flex-1 p-5 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-md dark:hover:shadow-black/20">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">{exp.role}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        {exp.org && (
                          <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.org}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-3">
                      <button
                        id={`edit-exp-${exp.id}`}
                        onClick={() => { setEditTarget(exp); setModalOpen(true); }}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-exp-${exp.id}`}
                        onClick={() => setDeleteTarget(exp.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{exp.description}</p>

                  {/* Bullet points */}
                  {exp.points.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 flex-shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Icon meta footer */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-0.5 rounded-full border border-neutral-100 dark:border-neutral-800">
                      {exp.iconName}
                    </span>
                    <span className="text-[11px] text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-600">{exp.iconPlatform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={closeModal} title={editTarget ? "Edit Experience" : "Add Experience"} description="Timeline entry for your work history or education." size="lg">
        <ExperienceForm
          defaultValues={editTarget ? {
            ...editTarget,
            org: editTarget.org ?? "",
            points: editTarget.points.join(", "),
          } : {
            iconPlatform: "lucide",
            sortOrder: experiences.length,
            points: "" as any
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await deleteExperience(deleteTarget!); setDeleteTarget(null); }}
        title="Delete experience?"
        message="This timeline entry will be permanently removed."
        isLoading={isLoading}
      />
    </div>
  );
}
