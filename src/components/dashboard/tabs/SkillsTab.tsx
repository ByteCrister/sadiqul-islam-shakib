"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import { skillSchema, SkillFormValues } from "@/utils/validations/skill.validation";
import { SKILL_CATEGORIES, ICON_PLATFORMS } from "@/utils/validations/shared.validation";
import type { DSkill, SkillCategory } from "@/types/dashboard.types";
import FormModal from "../shared/FormModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import IconPicker from "../shared/IconPicker";

const CATEGORY_COLORS: Record<SkillCategory, { pill: string; dot: string }> = {
  Frontend:    { pill: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", dot: "bg-blue-500" },
  Backend:     { pill: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", dot: "bg-emerald-500" },
  Database:    { pill: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", dot: "bg-amber-500" },
  Programming: { pill: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", dot: "bg-purple-500" },
  Tools:       { pill: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700", dot: "bg-neutral-400" },
};

function SkillForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<SkillFormValues>;
  onSubmit: (data: SkillFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultValues ?? { iconPlatform: "react-icons", sortOrder: 0 },
  });

  const iconPlatform = watch("iconPlatform");
  const iconName = watch("iconName");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Skill Name *</label>
          <input {...register("name")} placeholder="React" className="form-input" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Category *</label>
          <select {...register("category")} className="form-input">
            <option value="">Select category…</option>
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category.message}</p>}
        </div>
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
            platform={iconPlatform || "react-icons"}
            placeholder="SiReact, Mail..."
          />
          {errors.iconName && <p className="form-error">{errors.iconName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="form-label">Sort Order</label>
        <input {...register("sortOrder", { valueAsNumber: true })} type="number" min={0} className="form-input w-32" />
      </div>

      <div className="flex justify-end pt-1">
        <button
          id="skill-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Skill
        </button>
      </div>
    </form>
  );
}

export default function SkillsTab() {
  const { skills, loading, error, fetchSkills, createSkill, updateSkill, deleteSkill } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DSkill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const isLoading = loading.skills;

  useEffect(() => { fetchSkills(); }, []);

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (data: SkillFormValues) => {
    if (editTarget) {
      await updateSkill(editTarget.id, data);
    } else {
      await createSkill(data);
    }
    closeModal();
  };

  const grouped = SKILL_CATEGORIES.reduce<Record<string, DSkill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as any);

  const filledCategories = SKILL_CATEGORIES.filter((c) => grouped[c]?.length);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Skills</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{skills.length} skill{skills.length !== 1 ? "s" : ""} across {filledCategories.length} categor{filledCategories.length !== 1 ? "ies" : "y"}</p>
        </div>
        <button
          id="add-skill-btn"
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {error.skills && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.skills}
        </div>
      )}

      {isLoading && skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading skills…</p>
        </div>
      ) : skills.length === 0 ? (
        <EmptyState title="No skills yet" description="Add your tech skills grouped by category to showcase your expertise." />
      ) : (
        <div className="space-y-8">
          {SKILL_CATEGORIES.map((cat) => {
            if (!grouped[cat]?.length) return null;
            const colors = CATEGORY_COLORS[cat as SkillCategory];
            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${colors.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {cat}
                  </div>
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-600 tabular-nums">{grouped[cat].length}</span>
                  <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {grouped[cat].map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[11px] font-mono text-neutral-300 dark:text-neutral-700 w-4 text-center tabular-nums">{skill.sortOrder}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{skill.name}</p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 truncate mt-0.5">{skill.iconName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all ml-2 flex-shrink-0">
                        <button
                          id={`edit-skill-${skill.id}`}
                          onClick={() => { setEditTarget(skill); setModalOpen(true); }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-skill-${skill.id}`}
                          onClick={() => setDeleteTarget(skill.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={closeModal} title={editTarget ? "Edit Skill" : "Add Skill"} description="Skill will be displayed grouped by category." size="md">
        <SkillForm
          defaultValues={editTarget ?? {
            iconPlatform: "react-icons",
            sortOrder: skills.length,
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await deleteSkill(deleteTarget!); setDeleteTarget(null); }}
        title="Delete skill?"
        message="This skill will be permanently removed from your portfolio."
        isLoading={isLoading}
      />
    </div>
  );
}
