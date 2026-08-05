"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Mail } from "lucide-react";

/** Returns true when the href is a mailto: link */
const isEmail = (href: string) => href.startsWith("mailto:");

/** For display: strips mailto: prefix so we show the raw address */
const displayHref = (href: string) => (isEmail(href) ? href.replace(/^mailto:/, "") : href);
import { useDashboardStore } from "@/store/dashboard.store";
import { socialLinkSchema, SocialLinkFormValues } from "@/utils/validations/social-link.validation";
import { ICON_PLATFORMS, SOCIAL_LINK_CONTEXTS } from "@/utils/validations/shared.validation";
import type { DSocialLink } from "@/types/dashboard.types";
import FormModal from "../shared/FormModal";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import IconPicker from "../shared/IconPicker";

const CONTEXT_COLORS: Record<string, string> = {
  header:  "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
  footer:  "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  contact: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/20",
};

function SocialLinkForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<SocialLinkFormValues>;
  onSubmit: (data: SocialLinkFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: defaultValues ?? { iconPlatform: "lucide", context: "footer", sortOrder: 0 },
  });

  const iconPlatform = watch("iconPlatform");
  const iconName = watch("iconName");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="form-label">Name *</label>
          <input {...register("name")} placeholder="GitHub, LinkedIn..." className="form-input" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="form-label">Context *</label>
          <select {...register("context")} className="form-input">
            {SOCIAL_LINK_CONTEXTS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.context && <p className="form-error">{errors.context.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="form-label">
          URL or Email *
          <span className="ml-1.5 text-xs font-normal text-neutral-400 dark:text-neutral-600 normal-case">(https:// or user@example.com)</span>
        </label>
        <input
          {...register("href")}
          placeholder="https://github.com/... or hello@example.com"
          className="form-input"
        />
        {errors.href && <p className="form-error">{errors.href.message}</p>}
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
            placeholder="Github, Linkedin..."
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
          id="social-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Link
        </button>
      </div>
    </form>
  );
}

export default function SocialLinksTab() {
  const { socialLinks, loading, error, fetchSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DSocialLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const isLoading = loading.socialLinks;

  useEffect(() => { fetchSocialLinks(); }, []);

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (data: SocialLinkFormValues) => {
    if (editTarget) {
      await updateSocialLink(editTarget.id, data);
    } else {
      await createSocialLink(data);
    }
    closeModal();
  };

  const sortedLinks = [...socialLinks].sort((a, b) => {
    if (a.context !== b.context) return a.context.localeCompare(b.context);
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Social Links</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{socialLinks.length} link{socialLinks.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button
          id="add-social-btn"
          onClick={() => {
            setEditTarget(null);
            // Default sortOrder to the end of the list for new links
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {error.socialLinks && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error.socialLinks}
        </div>
      )}

      {isLoading && socialLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-400">Loading links…</p>
        </div>
      ) : socialLinks.length === 0 ? (
        <EmptyState title="No social links yet" description="Add links to your social profiles, displayed in your header, footer, or contact section." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {sortedLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group hover:shadow-sm"
            >
              {/* Sort badge */}
              <span className="text-[11px] font-mono text-neutral-300 dark:text-neutral-700 w-4 text-center tabular-nums flex-shrink-0">{link.sortOrder}</span>

              {/* Name + URL */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{link.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${CONTEXT_COLORS[link.context] ?? CONTEXT_COLORS.footer}`}>
                    {link.context}
                  </span>
                </div>
                <a
                  href={link.href}
                  target={isEmail(link.href) ? undefined : "_blank"}
                  rel={isEmail(link.href) ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors max-w-xs truncate"
                >
                  {isEmail(link.href)
                    ? <Mail className="w-3 h-3 flex-shrink-0" />
                    : <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                  <span className="truncate">{displayHref(link.href)}</span>
                </a>
              </div>

              {/* Icon info */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-0.5 rounded-full border border-neutral-100 dark:border-neutral-800">
                  {link.iconName}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                <button
                  id={`edit-link-${link.id}`}
                  onClick={() => { setEditTarget(link); setModalOpen(true); }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`delete-link-${link.id}`}
                  onClick={() => setDeleteTarget(link.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={closeModal} title={editTarget ? "Edit Link" : "Add Social Link"} description="Links will appear in the specified site section." size="md">
        <SocialLinkForm
          defaultValues={editTarget ?? { iconPlatform: "lucide", context: "footer", sortOrder: socialLinks.length }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await deleteSocialLink(deleteTarget!); setDeleteTarget(null); }}
        title="Delete social link?"
        message="This link will be permanently removed from all site sections."
        isLoading={isLoading}
      />
    </div>
  );
}
