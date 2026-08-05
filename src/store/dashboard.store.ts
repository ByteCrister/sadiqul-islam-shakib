import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  DProject,
  DSkill,
  DExperience,
  DSocialLink,
  DSiteConfig,
  DCounter,
  DAsset,
  DProfileImage,
  DResume,
} from "@/types/dashboard.types";

// ─── Loading & Error state keys ───────────────────────────────────────────────

type ResourceKey =
  | "projects"
  | "skills"
  | "experiences"
  | "socialLinks"
  | "siteConfigs"
  | "counters"
  | "assets"
  | "profileImages"
  | "resumes";

// ─── State ────────────────────────────────────────────────────────────────────

interface DashboardState {
  // Data
  projects: DProject[];
  skills: DSkill[];
  experiences: DExperience[];
  socialLinks: DSocialLink[];
  siteConfigs: DSiteConfig[];
  counters: DCounter[];
  assets: DAsset[];
  profileImages: DProfileImage[];
  resumes: DResume[];

  // UI state
  loading: Record<ResourceKey, boolean>;
  error: Record<ResourceKey, string | null>;
  fetched: Record<ResourceKey, boolean>;

  // ── Project actions ────────────────────────────────────────────────────────
  setProjects: (projects: DProject[]) => void;
  fetchProjects: (force?: boolean) => Promise<void>;
  createProject: (data: Omit<DProject, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProject: (id: string, data: Partial<DProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // ── Skill actions ──────────────────────────────────────────────────────────
  setSkills: (skills: DSkill[]) => void;
  fetchSkills: (force?: boolean) => Promise<void>;
  createSkill: (data: Omit<DSkill, "id">) => Promise<void>;
  updateSkill: (id: string, data: Partial<DSkill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  // ── Experience actions ─────────────────────────────────────────────────────
  setExperiences: (experiences: DExperience[]) => void;
  fetchExperiences: (force?: boolean) => Promise<void>;
  createExperience: (data: Omit<DExperience, "id">) => Promise<void>;
  updateExperience: (id: string, data: Partial<DExperience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  // ── Social Link actions ────────────────────────────────────────────────────
  setSocialLinks: (links: DSocialLink[]) => void;
  fetchSocialLinks: (force?: boolean) => Promise<void>;
  createSocialLink: (data: Omit<DSocialLink, "id">) => Promise<void>;
  updateSocialLink: (id: string, data: Partial<DSocialLink>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;

  // ── Site Config actions ────────────────────────────────────────────────────
  setSiteConfigs: (configs: DSiteConfig[]) => void;
  fetchSiteConfigs: (force?: boolean) => Promise<void>;
  upsertSiteConfig: (key: string, value: string) => Promise<void>;

  // ── Counter actions ────────────────────────────────────────────────────────
  setCounters: (counters: DCounter[]) => void;
  fetchCounters: (force?: boolean) => Promise<void>;
  createCounter: (data: Omit<DCounter, "id">) => Promise<void>;
  updateCounter: (id: string, data: Partial<DCounter>) => Promise<void>;
  deleteCounter: (id: string) => Promise<void>;

  // ── Asset actions ──────────────────────────────────────────────────────────
  setAssets: (assets: DAsset[]) => void;
  fetchAssets: (force?: boolean) => Promise<void>;

  // ── Profile Image actions ──────────────────────────────────────────────────
  setProfileImages: (images: DProfileImage[]) => void;
  fetchProfileImages: (force?: boolean) => Promise<void>;
  createProfileImage: (data: { assetId: string; label: string }) => Promise<void>;
  updateProfileImage: (id: string, data: { label?: string; isActive?: boolean }) => Promise<void>;
  deleteProfileImage: (id: string) => Promise<void>;

  // ── Resume actions ─────────────────────────────────────────────────────────
  setResumes: (resumes: DResume[]) => void;
  fetchResumes: (force?: boolean) => Promise<void>;
  createResume: (data: { assetId: string; label: string }) => Promise<void>;
  updateResume: (id: string, data: { label?: string; isActive?: boolean }) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;

  // ── Helpers ────────────────────────────────────────────────────────────────
  setLoading: (key: ResourceKey, value: boolean) => void;
  setError: (key: ResourceKey, message: string | null) => void;
  setFetched: (key: ResourceKey, value: boolean) => void;
  resetErrors: () => void;
}

// ─── Initial maps ─────────────────────────────────────────────────────────────

const initialLoading: Record<ResourceKey, boolean> = {
  projects: false,
  skills: false,
  experiences: false,
  socialLinks: false,
  siteConfigs: false,
  counters: false,
  assets: false,
  profileImages: false,
  resumes: false,
};

const initialError: Record<ResourceKey, string | null> = {
  projects: null,
  skills: null,
  experiences: null,
  socialLinks: null,
  siteConfigs: null,
  counters: null,
  assets: null,
  profileImages: null,
  resumes: null,
};

const initialFetched: Record<ResourceKey, boolean> = {
  projects: false,
  skills: false,
  experiences: false,
  socialLinks: false,
  siteConfigs: false,
  counters: false,
  assets: false,
  profileImages: false,
  resumes: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────────────────
      projects: [],
      skills: [],
      experiences: [],
      socialLinks: [],
      siteConfigs: [],
      counters: [],
      assets: [],
      profileImages: [],
      resumes: [],
      loading: initialLoading,
      error: initialError,
      fetched: initialFetched,

      // ── Helpers ──────────────────────────────────────────────────────────
      setLoading: (key, value) =>
        set((s) => ({ loading: { ...s.loading, [key]: value } })),
      setError: (key, message) =>
        set((s) => ({ error: { ...s.error, [key]: message } })),
      setFetched: (key, value) =>
        set((s) => ({ fetched: { ...s.fetched, [key]: value } })),
      resetErrors: () => set({ error: initialError }),

      // ── Projects ─────────────────────────────────────────────────────────
      setProjects: (projects) => set({ projects }),
      fetchProjects: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.projects) return;
        
        setLoading("projects", true);
        setError("projects", null);
        try {
          const res = await fetch("/api/v1/projects");
          if (!res.ok) throw new Error("Failed to fetch projects");
          const json = await res.json();
          set({ projects: json.data });
          setFetched("projects", true);
        } catch (err: any) {
          setError("projects", err.message);
        } finally {
          setLoading("projects", false);
        }
      },
      createProject: async (data) => {
        const { setLoading, setError } = get();
        setLoading("projects", true);
        setError("projects", null);
        try {
          const res = await fetch("/api/v1/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create project");
          const json = await res.json();
          set((s) => ({ projects: [...s.projects, json.data] }));
        } catch (err: any) {
          setError("projects", err.message);
          throw err;
        } finally {
          setLoading("projects", false);
        }
      },
      updateProject: async (id, data) => {
        const { setLoading, setError } = get();
        setLoading("projects", true);
        setError("projects", null);
        try {
          const res = await fetch(`/api/v1/projects/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update project");
          const json = await res.json();
          set((s) => ({
            projects: s.projects.map((p) => (p.id === id ? json.data : p)),
          }));
        } catch (err: any) {
          setError("projects", err.message);
          throw err;
        } finally {
          setLoading("projects", false);
        }
      },
      deleteProject: async (id) => {
        const { setLoading, setError } = get();
        setLoading("projects", true);
        setError("projects", null);
        try {
          const res = await fetch(`/api/v1/projects/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete project");
          set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
        } catch (err: any) {
          setError("projects", err.message);
          throw err;
        } finally {
          setLoading("projects", false);
        }
      },

      // ── Skills ───────────────────────────────────────────────────────────
      setSkills: (skills) => set({ skills }),
      fetchSkills: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.skills) return;

        setLoading("skills", true);
        setError("skills", null);
        try {
          const res = await fetch("/api/v1/skills");
          if (!res.ok) throw new Error("Failed to fetch skills");
          const json = await res.json();
          set({ skills: json.data });
          setFetched("skills", true);
        } catch (err: any) {
          setError("skills", err.message);
        } finally {
          setLoading("skills", false);
        }
      },
      createSkill: async (data) => {
        const { setLoading, setError, fetchSkills } = get();
        setLoading("skills", true);
        setError("skills", null);
        try {
          const res = await fetch("/api/v1/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create skill");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSkills(true);
        } catch (err: any) {
          setError("skills", err.message);
          throw err;
        } finally {
          setLoading("skills", false);
        }
      },
      updateSkill: async (id, data) => {
        const { setLoading, setError, fetchSkills } = get();
        setLoading("skills", true);
        setError("skills", null);
        try {
          const res = await fetch(`/api/v1/skills/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update skill");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSkills(true);
        } catch (err: any) {
          setError("skills", err.message);
          throw err;
        } finally {
          setLoading("skills", false);
        }
      },
      deleteSkill: async (id) => {
        const { setLoading, setError, fetchSkills } = get();
        setLoading("skills", true);
        setError("skills", null);
        try {
          const res = await fetch(`/api/v1/skills/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete skill");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSkills(true);
        } catch (err: any) {
          setError("skills", err.message);
          throw err;
        } finally {
          setLoading("skills", false);
        }
      },

      // ── Experiences ──────────────────────────────────────────────────────
      setExperiences: (experiences) => set({ experiences }),
      fetchExperiences: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.experiences) return;

        setLoading("experiences", true);
        setError("experiences", null);
        try {
          const res = await fetch("/api/v1/experiences");
          if (!res.ok) throw new Error("Failed to fetch experiences");
          const json = await res.json();
          set({ experiences: json.data });
          setFetched("experiences", true);
        } catch (err: any) {
          setError("experiences", err.message);
        } finally {
          setLoading("experiences", false);
        }
      },
      createExperience: async (data) => {
        const { setLoading, setError, fetchExperiences } = get();
        setLoading("experiences", true);
        setError("experiences", null);
        try {
          const res = await fetch("/api/v1/experiences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create experience");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchExperiences(true);
        } catch (err: any) {
          setError("experiences", err.message);
          throw err;
        } finally {
          setLoading("experiences", false);
        }
      },
      updateExperience: async (id, data) => {
        const { setLoading, setError, fetchExperiences } = get();
        setLoading("experiences", true);
        setError("experiences", null);
        try {
          const res = await fetch(`/api/v1/experiences/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update experience");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchExperiences(true);
        } catch (err: any) {
          setError("experiences", err.message);
          throw err;
        } finally {
          setLoading("experiences", false);
        }
      },
      deleteExperience: async (id) => {
        const { setLoading, setError, fetchExperiences } = get();
        setLoading("experiences", true);
        setError("experiences", null);
        try {
          const res = await fetch(`/api/v1/experiences/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete experience");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchExperiences(true);
        } catch (err: any) {
          setError("experiences", err.message);
          throw err;
        } finally {
          setLoading("experiences", false);
        }
      },

      // ── Social Links ─────────────────────────────────────────────────────
      setSocialLinks: (socialLinks) => set({ socialLinks }),
      fetchSocialLinks: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.socialLinks) return;

        setLoading("socialLinks", true);
        setError("socialLinks", null);
        try {
          const res = await fetch("/api/v1/social-links");
          if (!res.ok) throw new Error("Failed to fetch social links");
          const json = await res.json();
          set({ socialLinks: json.data });
          setFetched("socialLinks", true);
        } catch (err: any) {
          setError("socialLinks", err.message);
        } finally {
          setLoading("socialLinks", false);
        }
      },
      createSocialLink: async (data) => {
        const { setLoading, setError, fetchSocialLinks } = get();
        setLoading("socialLinks", true);
        setError("socialLinks", null);
        try {
          const res = await fetch("/api/v1/social-links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create social link");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSocialLinks(true);
        } catch (err: any) {
          setError("socialLinks", err.message);
          throw err;
        } finally {
          setLoading("socialLinks", false);
        }
      },
      updateSocialLink: async (id, data) => {
        const { setLoading, setError, fetchSocialLinks } = get();
        setLoading("socialLinks", true);
        setError("socialLinks", null);
        try {
          const res = await fetch(`/api/v1/social-links/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update social link");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSocialLinks(true);
        } catch (err: any) {
          setError("socialLinks", err.message);
          throw err;
        } finally {
          setLoading("socialLinks", false);
        }
      },
      deleteSocialLink: async (id) => {
        const { setLoading, setError, fetchSocialLinks } = get();
        setLoading("socialLinks", true);
        setError("socialLinks", null);
        try {
          const res = await fetch(`/api/v1/social-links/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete social link");
          // Re-fetch to sync with backend's automatic sortOrder compaction
          await fetchSocialLinks(true);
        } catch (err: any) {
          setError("socialLinks", err.message);
          throw err;
        } finally {
          setLoading("socialLinks", false);
        }
      },

      // ── Site Configs ─────────────────────────────────────────────────────
      setSiteConfigs: (siteConfigs) => set({ siteConfigs }),
      fetchSiteConfigs: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.siteConfigs) return;

        setLoading("siteConfigs", true);
        setError("siteConfigs", null);
        try {
          const res = await fetch("/api/v1/site-config");
          if (!res.ok) throw new Error("Failed to fetch site configs");
          const json = await res.json();
          set({ siteConfigs: json.data });
          setFetched("siteConfigs", true);
        } catch (err: any) {
          setError("siteConfigs", err.message);
        } finally {
          setLoading("siteConfigs", false);
        }
      },
      upsertSiteConfig: async (key, value) => {
        const { setLoading, setError } = get();
        setLoading("siteConfigs", true);
        setError("siteConfigs", null);
        try {
          const res = await fetch("/api/v1/site-config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value }),
          });
          if (!res.ok) throw new Error("Failed to save site config");
          const json = await res.json();
          const upserted = json.data;
          set((s) => {
            const exists = s.siteConfigs.find((c) => c.key === key);
            return {
              siteConfigs: exists
                ? s.siteConfigs.map((c) => (c.key === key ? upserted : c))
                : [...s.siteConfigs, upserted],
            };
          });
        } catch (err: any) {
          setError("siteConfigs", err.message);
          throw err;
        } finally {
          setLoading("siteConfigs", false);
        }
      },

      // ── Counters ─────────────────────────────────────────────────────────
      setCounters: (counters) => set({ counters }),
      fetchCounters: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.counters) return;

        setLoading("counters", true);
        setError("counters", null);
        try {
          const res = await fetch("/api/v1/counters");
          if (!res.ok) throw new Error("Failed to fetch counters");
          const json = await res.json();
          set({ counters: json.data });
          setFetched("counters", true);
        } catch (err: any) {
          setError("counters", err.message);
        } finally {
          setLoading("counters", false);
        }
      },
      createCounter: async (data) => {
        const { setLoading, setError } = get();
        setLoading("counters", true);
        setError("counters", null);
        try {
          const res = await fetch("/api/v1/counters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create counter");
          const json = await res.json();
          set((s) => ({ counters: [...s.counters, json.data] }));
        } catch (err: any) {
          setError("counters", err.message);
          throw err;
        } finally {
          setLoading("counters", false);
        }
      },
      updateCounter: async (id, data) => {
        const { setLoading, setError } = get();
        setLoading("counters", true);
        setError("counters", null);
        try {
          const res = await fetch(`/api/v1/counters/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update counter");
          const json = await res.json();
          set((s) => ({
            counters: s.counters.map((c) => (c.id === id ? json.data : c)),
          }));
        } catch (err: any) {
          setError("counters", err.message);
          throw err;
        } finally {
          setLoading("counters", false);
        }
      },
      deleteCounter: async (id) => {
        const { setLoading, setError } = get();
        setLoading("counters", true);
        setError("counters", null);
        try {
          const res = await fetch(`/api/v1/counters/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete counter");
          set((s) => ({ counters: s.counters.filter((c) => c.id !== id) }));
        } catch (err: any) {
          setError("counters", err.message);
          throw err;
        } finally {
          setLoading("counters", false);
        }
      },

      // ── Assets ───────────────────────────────────────────────────────────
      setAssets: (assets) => set({ assets }),
      fetchAssets: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.assets) return;

        setLoading("assets", true);
        setError("assets", null);
        try {
          const res = await fetch("/api/v1/assets");
          if (!res.ok) throw new Error("Failed to fetch assets");
          const json = await res.json();
          set({ assets: json.data });
          setFetched("assets", true);
        } catch (err: any) {
          setError("assets", err.message);
        } finally {
          setLoading("assets", false);
        }
      },

      // ── Profile Images ────────────────────────────────────────────────────
      setProfileImages: (profileImages) => set({ profileImages }),
      fetchProfileImages: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.profileImages) return;

        setLoading("profileImages", true);
        setError("profileImages", null);
        try {
          const res = await fetch("/api/v1/profile-images");
          if (!res.ok) throw new Error("Failed to fetch profile images");
          const json = await res.json();
          set({ profileImages: json.data });
          setFetched("profileImages", true);
        } catch (err: any) {
          setError("profileImages", err.message);
        } finally {
          setLoading("profileImages", false);
        }
      },
      createProfileImage: async (data) => {
        const { setLoading, setError, fetchProfileImages } = get();
        setLoading("profileImages", true);
        setError("profileImages", null);
        try {
          const res = await fetch("/api/v1/profile-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create profile image");
          await fetchProfileImages(true);
        } catch (err: any) {
          setError("profileImages", err.message);
          throw err;
        } finally {
          setLoading("profileImages", false);
        }
      },
      updateProfileImage: async (id, data) => {
        const { setLoading, setError, fetchProfileImages } = get();
        setLoading("profileImages", true);
        setError("profileImages", null);
        try {
          const res = await fetch(`/api/v1/profile-images/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update profile image");
          await fetchProfileImages(true);
        } catch (err: any) {
          setError("profileImages", err.message);
          throw err;
        } finally {
          setLoading("profileImages", false);
        }
      },
      deleteProfileImage: async (id) => {
        const { setLoading, setError, fetchProfileImages } = get();
        setLoading("profileImages", true);
        setError("profileImages", null);
        try {
          const res = await fetch(`/api/v1/profile-images/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete profile image");
          // Server handles full cascade: profile_image → asset → asset_file → Cloudinary
          await fetchProfileImages(true);
        } catch (err: any) {
          setError("profileImages", err.message);
          throw err;
        } finally {
          setLoading("profileImages", false);
        }
      },

      // ── Resumes ───────────────────────────────────────────────────────────
      setResumes: (resumes) => set({ resumes }),
      fetchResumes: async (force = false) => {
        const { setLoading, setError, setFetched, fetched } = get();
        if (!force && fetched.resumes) return;

        setLoading("resumes", true);
        setError("resumes", null);
        try {
          const res = await fetch("/api/v1/resumes");
          if (!res.ok) throw new Error("Failed to fetch resumes");
          const json = await res.json();
          set({ resumes: json.data });
          setFetched("resumes", true);
        } catch (err: any) {
          setError("resumes", err.message);
        } finally {
          setLoading("resumes", false);
        }
      },
      createResume: async (data) => {
        const { setLoading, setError, fetchResumes } = get();
        setLoading("resumes", true);
        setError("resumes", null);
        try {
          const res = await fetch("/api/v1/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create resume");
          await fetchResumes(true);
        } catch (err: any) {
          setError("resumes", err.message);
          throw err;
        } finally {
          setLoading("resumes", false);
        }
      },
      updateResume: async (id, data) => {
        const { setLoading, setError, fetchResumes } = get();
        setLoading("resumes", true);
        setError("resumes", null);
        try {
          const res = await fetch(`/api/v1/resumes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update resume");
          await fetchResumes(true);
        } catch (err: any) {
          setError("resumes", err.message);
          throw err;
        } finally {
          setLoading("resumes", false);
        }
      },
      deleteResume: async (id) => {
        const { setLoading, setError, fetchResumes } = get();
        setLoading("resumes", true);
        setError("resumes", null);
        try {
          const res = await fetch(`/api/v1/resumes/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete resume");
          // Server handles full cascade: resume → asset → asset_file → Cloudinary
          await fetchResumes(true);
        } catch (err: any) {
          setError("resumes", err.message);
          throw err;
        } finally {
          setLoading("resumes", false);
        }
      },
    }),
    { name: "dashboard-store" }
  )
);
