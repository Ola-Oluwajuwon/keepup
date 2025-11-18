"use client";

import { List, SquareArrowOutUpRight } from "lucide-react";
import type { Resolution } from "@/types";

interface ResolutionCardCompactProps {
  resolution: Resolution;
  onOpenDetail: () => void;
}

export function ResolutionCardCompact({
  resolution,
  onOpenDetail,
}: ResolutionCardCompactProps) {
  // Truncate title to ~7 characters
  const truncatedTitle =
    resolution.title.length > 7
      ? `${resolution.title.slice(0, 7)}...`
      : resolution.title;

  // Get description preview (20 words max)
  const getPreviewText = () => {
    const text = resolution.description || resolution.why_text || "";
    if (!text) return "No description available";

    const words = text.split(" ");
    if (words.length <= 20) return text;
    return `${words.slice(0, 20).join(" ")}...`;
  };

  return (
    <div className="w-48 rounded-xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-200">
        <List className="h-4 w-4 text-slate-600 shrink-0" />
        <h3
          className="text-sm font-semibold text-slate-900 flex-1 truncate"
          title={resolution.title}
        >
          {truncatedTitle}
        </h3>
        <button
          onClick={onOpenDetail}
          className="shrink-0 text-slate-600 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100"
          aria-label="View full details"
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {getPreviewText()}
        </p>
      </div>
    </div>
  );
}
