"use client";

import { useState } from "react";
import { User, Briefcase, Code, GraduationCap, Link2, Settings, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileTab from "./tabs/ProfileTab";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import ExperienceTab from "./tabs/ExperienceTab";
import SocialLinksTab from "./tabs/SocialLinksTab";
import SiteConfigTab from "./tabs/SiteConfigTab";
import CountersTab from "./tabs/CountersTab";

const tabs = [
  { id: "profile", label: "Profile", icon: User, component: ProfileTab },
  { id: "projects", label: "Projects", icon: Briefcase, component: ProjectsTab },
  { id: "skills", label: "Skills", icon: Code, component: SkillsTab },
  { id: "experience", label: "Experience", icon: GraduationCap, component: ExperienceTab },
  { id: "social", label: "Social Links", icon: Link2, component: SocialLinksTab },
  { id: "counters", label: "Counters", icon: BarChart, component: CountersTab },
  { id: "config", label: "Site Config", icon: Settings, component: SiteConfigTab },
] as const;

type TabId = typeof tabs[number]["id"];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ProfileTab;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Scrollable Tab Navigation */}
      <div className="border-b border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-2xl sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide py-3" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-[0.97]
                    ${
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md shadow-neutral-900/10 dark:shadow-white/10"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-neutral-900" : "text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
