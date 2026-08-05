"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Loader2, Save, Settings2, Clock } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";
import { siteConfigSchema, SiteConfigFormValues } from "@/utils/validations/site-config.validation";
import type { DSiteConfig } from "@/types/dashboard.types";
import FormModal from "../shared/FormModal";
import EmptyState from "../shared/EmptyState";

function SiteConfigForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<SiteConfigFormValues>;
  onSubmit: (data: SiteConfigFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<SiteConfigFormValues>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: defaultValues ?? { key: "", value: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="form-label">Key * <span className="text-neutral-400 dark:text-neutral-600 normal-case font-normal">(lowercase and underscores only)</span></label>
        <input
          {...register("key")}
          placeholder="e.g. hero_words"
          readOnly={!!defaultValues?.key}
          className={`form-input font-mono ${defaultValues?.key ? "opacity-60 cursor-not-allowed" : ""}`}
        />
        {errors.key && <p className="form-error">{errors.key.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="form-label">Value *</label>
        <textarea {...register("value")} rows={5} placeholder="Value (JSON or plain text)" className="form-input font-mono text-sm resize-y" />
        {errors.value && <p className="form-error">{errors.value.message}</p>}
      </div>

      <div className="flex justify-end pt-1">
        <button
          id="config-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Config
        </button>
      </div>
    </form>
  );
}

export default function SiteConfigTab() {
  const { siteConfigs, loading, error, fetchSiteConfigs, upsertSiteConfig } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DSiteConfig | null>(null);
  const isLoading = loading.siteConfigs;

  useEffect(() => { fetchSiteConfigs(); }, []);

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (data: SiteConfigFormValues) => {
    await upsertSiteConfig(data.key, data.value);
    closeModal();
  };

  const sortedConfigs = [...siteConfigs].sort((a, b) => a.key.localeCompare(b.key));

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Site Config</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{siteConfigs.length} key{siteConfigs.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button
          id="add-config-btn"
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Config
        </button>
      </div>

      {error.siteConfigs && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.siteConfigs}
        </div>
      )}

      {isLoading && siteConfigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading configurations…</p>
        </div>
      ) : siteConfigs.length === 0 ? (
        <EmptyState title="No configurations yet" description="Add key-value pairs to control global site settings like hero words, taglines, and more." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedConfigs.map((config) => (
            <div
              key={config.id}
              className="flex flex-col bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group hover:shadow-sm"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-50/70 dark:bg-neutral-900/80 border-b border-neutral-100 dark:border-neutral-800/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Settings2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <h4 className="font-mono text-sm font-bold text-neutral-900 dark:text-white truncate">{config.key}</h4>
                </div>
                <button
                  id={`edit-config-${config.key}`}
                  onClick={() => { setEditTarget(config); setModalOpen(true); }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Value */}
              <div className="px-5 py-4 flex-1">
                <pre className="text-xs text-neutral-700 dark:text-neutral-300 font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {config.value}
                </pre>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-1.5 px-5 py-3 border-t border-neutral-100 dark:border-neutral-800/60">
                <Clock className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
                <p className="text-[11px] text-neutral-400 dark:text-neutral-600">
                  Updated {new Date(config.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={closeModal} title={editTarget ? "Edit Config" : "Add Config"} description="Key-value pairs for controlling site-wide settings." size="md">
        <SiteConfigForm defaultValues={editTarget ?? undefined} onSubmit={handleSubmit} isLoading={isLoading} />
      </FormModal>
    </div>
  );
}
