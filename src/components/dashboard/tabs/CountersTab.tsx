"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, TrendingUp } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import { counterSchema, CounterFormValues } from "@/utils/validations/counter.validation";
import { ICON_PLATFORMS } from "@/utils/validations/shared.validation";
import type { DCounter } from "@/types/dashboard.types";
import FormModal from "../shared/FormModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import IconPicker from "../shared/IconPicker";

function CounterForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<CounterFormValues>;
  onSubmit: (data: CounterFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CounterFormValues>({
    resolver: zodResolver(counterSchema),
    defaultValues: defaultValues ?? { iconPlatform: "lucide", sortOrder: 0, value: 0 },
  });

  const iconPlatform = watch("iconPlatform");
  const iconName = watch("iconName");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Label *</label>
          <input {...register("label")} placeholder="Projects Completed" className="form-input" />
          {errors.label && <p className="form-error">{errors.label.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Value *</label>
          <input {...register("value", { valueAsNumber: true })} type="number" min={0} className="form-input" />
          {errors.value && <p className="form-error">{errors.value.message}</p>}
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
            platform={iconPlatform || "lucide"}
            placeholder="Award, Star..."
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
          id="counter-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Counter
        </button>
      </div>
    </form>
  );
}

export default function CountersTab() {
  const { counters, loading, error, fetchCounters, createCounter, updateCounter, deleteCounter } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DCounter | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const isLoading = loading.counters;

  useEffect(() => { fetchCounters(); }, []);

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (data: CounterFormValues) => {
    if (editTarget) {
      await updateCounter(editTarget.id, data);
    } else {
      await createCounter(data);
    }
    closeModal();
  };

  const sortedCounters = [...counters].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Counters</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{counters.length} stat{counters.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button
          id="add-counter-btn"
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Counter
        </button>
      </div>

      {error.counters && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.counters}
        </div>
      )}

      {isLoading && counters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading counters…</p>
        </div>
      ) : counters.length === 0 ? (
        <EmptyState title="No counters yet" description="Add statistical counters to showcase achievements on your about page." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedCounters.map((counter) => (
            <div
              key={counter.id}
              className="relative flex flex-col gap-3 p-5 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/20"
            >
              {/* Actions */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  id={`edit-counter-${counter.id}`}
                  onClick={() => { setEditTarget(counter); setModalOpen(true); }}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`delete-counter-${counter.id}`}
                  onClick={() => setDeleteTarget(counter.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>

              {/* Value + Label */}
              <div>
                <p className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-none">{counter.value}</p>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-1.5">{counter.label}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-0.5 rounded-full">
                  {counter.iconName}
                </span>
                <span className="text-[11px] text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-600">{counter.iconPlatform}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={closeModal} title={editTarget ? "Edit Counter" : "Add Counter"} description="Configure a stat displayed on your about page." size="sm">
        <CounterForm defaultValues={editTarget ?? undefined} onSubmit={handleSubmit} isLoading={isLoading} />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await deleteCounter(deleteTarget!); setDeleteTarget(null); }}
        title="Delete counter?"
        message="This counter will be permanently removed from your about page."
        isLoading={isLoading}
      />
    </div>
  );
}
