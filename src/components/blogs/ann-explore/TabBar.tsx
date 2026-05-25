"use client";
// src/components/nn/TabBar.tsx
import { useNN } from "./NNProvider";
import { S, STYLE } from "@/styles/explore.styles";
import type { TabKey } from "@/types/nn.types";

const TABS: { key: TabKey; label: string }[] = [
  { key: "visualize", label: "🕸 Network" },
  { key: "stepbystep", label: "👣 Step-by-Step" },
  { key: "charts", label: "📈 Charts" },
  { key: "concepts", label: "📖 Concepts" },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useNN();

  return (
    <nav className={S.tabBar}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? S.tabActive : S.tabInactive}
          style={STYLE.fontDisplay}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}