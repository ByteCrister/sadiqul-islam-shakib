"use client";
// src/components/nn/NeuralNetworkExplorer.tsx
import { NNProvider, useNN } from "./NNProvider";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { TabBar } from "./TabBar";
import { NetworkTab } from "./NetworkTab";
import { StepByStepTab } from "./StepByStepTab";
import { ChartsTab } from "./ChartsTab";
import { ConceptsTab } from "./ConceptsTab";
import { S, STYLE } from "@/styles/explore.styles";
// Import font variables so CSS custom properties are registered
import { deliusSwashCaps, jetbrainsMono } from "@/styles/explore.fonts";

function ExplorerInner() {
    const { activeTab, setActiveTab } = useNN();

    return (
        // Apply both font CSS variable classes at the root so all children inherit
        <div
            className={`${S.pageRoot} ${deliusSwashCaps.variable} ${jetbrainsMono.variable}`}
            style={STYLE.pageRoot}
        >
            <AppHeader />
            <div className={`${S.appShell} ${S.appShellHeight}`}>
                <Sidebar />
                <div className={S.mainArea}>
                    <TabBar />
                    <div className={`${S.tabContent} bg-white/30 backdrop-blur-sm min-h-0`}>
                        {activeTab === "visualize" && <NetworkTab />}
                        {activeTab === "stepbystep" && <StepByStepTab />}
                        {activeTab === "charts" && <ChartsTab />}
                        {activeTab === "concepts" && <ConceptsTab />}
                    </div>
                </div>
            </div>

            {/* Floating glossary button — Doodle style: offset shadow, bold border */}
            <button
                className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-[#263D5B] border-2 border-[#49B6E5] text-white text-xl flex items-center justify-center shadow-[3px_3px_0px_#49B6E5] hover:scale-110 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                onClick={() => setActiveTab("concepts")}
                title="Open Concepts"
            >
                📖
            </button>
        </div>
    );
}

export function NeuralNetworkExplorer() {
    return (
        <NNProvider>
            <ExplorerInner />
        </NNProvider>
    );
}