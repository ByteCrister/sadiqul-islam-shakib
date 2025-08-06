// zustand/store/usePortfolioStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// -------------------- Types --------------------
interface Counter {
    _id?: string
    label: string
    value: number
    iconName: string
}

interface Experience {
    _id?: string
    role: string
    org: string
    period: string
    description: string
    points: string[]
    iconName: string
}

interface Project {
    _id?: string
    slug: string
    title: string
    description: string
    tech: string[]
    liveUrl?: string
    githubUrl: string
    category: string
    thumbnail?: string
    fullScreen?: string
    images?: string[]
    timeline?: string
}

interface Skill {
    _id?: string
    name: string
    iconName: string
}

interface Social {
    _id?: string
    label: string
    href: string
    iconName: string
}

interface CV {
    title: string
    filePath: string
    active: boolean
}

interface View {
    timestamp: string
}

export interface UserProfile {
    _id?: string
    name: string
    email: string
    image?: string
    cv: CV[]
    views: View[]
}

type isLoggedIn = boolean

// -------------------- Store --------------------
interface PortfolioStore {
    counters: Counter[]
    experiences: Experience[]
    projects: Project[]
    skills: Skill[]
    socials: Social[]
    profile: UserProfile | null
    isLoggedIn: isLoggedIn

    setCounters: (c: Counter[]) => void
    setExperiences: (e: Experience[]) => void
    setProjects: (p: Project[]) => void
    setSkills: (s: Skill[]) => void
    setSocials: (s: Social[]) => void
    setProfile: (p: UserProfile | null) => void
    setIsLoggedIn: (l: boolean) => void

    addCounter: (c: Counter) => void
    updateCounter: (c: Counter) => void
    removeCounter: (id: string) => void

    addExperience: (e: Experience) => void
    updateExperience: (e: Experience) => void
    removeExperience: (id: string) => void

    addProject: (p: Project) => void
    updateProject: (p: Project) => void
    removeProject: (id: string) => void

    addSkill: (s: Skill) => void
    updateSkill: (s: Skill) => void
    removeSkill: (id: string) => void

    addSocial: (s: Social) => void
    updateSocial: (s: Social) => void
    removeSocial: (id: string) => void

    updateProfile: (p: UserProfile) => void
}

export const usePortfolioStore = create<PortfolioStore>()(
    devtools((set) => ({
        counters: [],
        experiences: [],
        projects: [],
        skills: [],
        socials: [],
        isLoggedIn: false,
        profile: null,

        setCounters: (c) => set({ counters: c }),
        setExperiences: (e) => set({ experiences: e }),
        setProjects: (p) => set({ projects: p }),
        setSkills: (s) => set({ skills: s }),
        setSocials: (s) => set({ socials: s }),
        setProfile: (p) => set({ profile: p }),
        setIsLoggedIn: (l: boolean) => set({ isLoggedIn: l }),

        addCounter: (c) => set((state) => ({ counters: [...state.counters, c] })),
        updateCounter: (c) => set((state) => ({
            counters: state.counters.map(item => item._id === c._id ? c : item)
        })),
        removeCounter: (id) => set((state) => ({
            counters: state.counters.filter(item => item._id !== id)
        })),

        addExperience: (e) => set((state) => ({ experiences: [...state.experiences, e] })),
        updateExperience: (e) => set((state) => ({
            experiences: state.experiences.map(item => item._id === e._id ? e : item)
        })),
        removeExperience: (id) => set((state) => ({
            experiences: state.experiences.filter(item => item._id !== id)
        })),

        addProject: (p) => set((state) => ({ projects: [...state.projects, p] })),
        updateProject: (p) => set((state) => ({
            projects: state.projects.map(item => item._id === p._id ? p : item)
        })),
        removeProject: (id) => set((state) => ({
            projects: state.projects.filter((p) => p._id !== id),
        })),

        addSkill: (s) => set((state) => ({ skills: [...state.skills, s] })),
        updateSkill: (s) => set((state) => ({
            skills: state.skills.map(item => item._id === s._id ? s : item)
        })),
        removeSkill: (id) => set((state) => ({
            skills: state.skills.filter(item => item._id !== id)
        })),

        addSocial: (s) => set((state) => ({ socials: [...state.socials, s] })),
        updateSocial: (s) => set((state) => ({
            socials: state.socials.map(item => item._id === s._id ? s : item)
        })),
        removeSocial: (id) => set((state) => ({
            socials: state.socials.filter(item => item._id !== id)
        })),

        updateProfile: (p) => set(() => ({ profile: p }))
    }))
)
