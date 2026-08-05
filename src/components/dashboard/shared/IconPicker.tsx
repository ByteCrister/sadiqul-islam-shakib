import { useState, useEffect, useRef } from "react";
import { Loader2, Search, Check } from "lucide-react";
import type { IconPlatform } from "@/types/dashboard.types";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  platform: IconPlatform;
  placeholder?: string;
  className?: string;
}

export default function IconPicker({
  value,
  onChange,
  platform,
  placeholder = "Search icons...",
  className = "",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Sync internal input value with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when platform or input changes
  useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/icons?platform=${platform}&q=${encodeURIComponent(inputValue)}`);
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setResults(json.data?.results || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, platform, isOpen]);

  const handleSelect = (icon: string) => {
    setInputValue(icon);
    onChange(icon);
    setIsOpen(false);
  };

  const isDirty = inputValue !== value;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isDirty) { e.preventDefault(); handleSelect(inputValue); }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-900 dark:focus:border-white transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-sm pr-16 shadow-sm shadow-black/5"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400 mr-1" />
          ) : isDirty ? (
            <button
              type="button"
              onClick={() => handleSelect(inputValue)}
              className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-2.5 py-1 rounded-lg transition-colors active:scale-[0.97]"
            >
              <Check className="w-3 h-3" /> Apply
            </button>
          ) : (
            <Search className="w-4 h-4 text-neutral-400 mr-1" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/70 rounded-xl shadow-xl shadow-neutral-900/10 dark:shadow-black/40 max-h-64 overflow-y-auto p-1.5">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-neutral-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching…
            </div>
          ) : results.length > 0 ? (
            results.map((icon) => {
              const active = icon === value;
              return (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleSelect(icon)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate ${
                    active
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="truncate">{icon}</span>
                  {active && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-2" />}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-neutral-500">
              No matching icons found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}