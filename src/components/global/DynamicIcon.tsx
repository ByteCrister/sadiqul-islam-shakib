"use client";

/**
 * DynamicIcon
 *
 * Renders a single icon by name from either:
 *   - lucide-react  (platform = "lucide")
 *   - react-icons   (platform = "react-icons", prefix determines the pack)
 *
 * Falls back to a neutral placeholder if the icon cannot be found.
 */

import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import type { IconPlatform } from "@/types/dashboard.types";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; className?: string }>;

interface DynamicIconProps {
  iconName: string;
  platform: IconPlatform;
  className?: string;
  size?: number | string;
}

export default function DynamicIcon({ iconName, platform, className = "w-5 h-5", size }: DynamicIconProps) {
  const [Icon, setIcon] = useState<SvgIcon | null>(null);

  useEffect(() => {
    if (!iconName) return;
    let cancelled = false;

    async function load() {
      try {
        if (platform === "lucide") {
          const mod = await import("lucide-react");
          const Comp = (mod as Record<string, unknown>)[iconName] as SvgIcon | undefined;
          if (!cancelled && Comp) setIcon(() => Comp);
        } else {
          // react-icons: the prefix (first 2 chars, e.g. "Si", "Fa", "Io") determines the sub-package.
          const prefix = iconName.slice(0, 2).toLowerCase();
          const packMap: Record<string, string> = {
            si: "react-icons/si",
            fa: "react-icons/fa",
            fi: "react-icons/fi",
            io: "react-icons/io",
            md: "react-icons/md",
            bs: "react-icons/bs",
            ai: "react-icons/ai",
            bi: "react-icons/bi",
            gi: "react-icons/gi",
            hi: "react-icons/hi",
            ri: "react-icons/ri",
            ti: "react-icons/ti",
            vsc: "react-icons/vsc",
          };
          const pack = packMap[prefix] ?? "react-icons/si";
          const mod = await import(/* @vite-ignore */ pack);
          const Comp = (mod as Record<string, unknown>)[iconName] as SvgIcon | undefined;
          if (!cancelled && Comp) setIcon(() => Comp);
        }
      } catch {
        // Silently fail — icon just won't render
      }
    }

    load();
    return () => { cancelled = true; };
  }, [iconName, platform]);

  if (!Icon) {
    // Neutral fallback square
    return <span className={`inline-block rounded bg-neutral-300 dark:bg-neutral-600 ${className}`} style={{ width: size, height: size }} />;
  }

  return <Icon className={className} size={size} />;
}
