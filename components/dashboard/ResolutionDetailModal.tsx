"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Resolution } from "@/types";

interface ResolutionDetailModalProps {
  resolution: Resolution | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResolutionDetailModal({
  resolution,
  open,
  onOpenChange,
}: ResolutionDetailModalProps) {
  if (!resolution) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {resolution.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Created on {formatDate(resolution.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Why Text */}
          {resolution.why_text && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Why this matters
              </h3>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                &ldquo;{resolution.why_text}&rdquo;
              </p>
            </div>
          )}

          {/* Description */}
          {resolution.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {resolution.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Start Date
              </h4>
              <p className="text-sm text-slate-900">
                {formatDate(resolution.start_date)}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Target Date
              </h4>
              <p className="text-sm text-slate-900">
                {formatDate(resolution.target_date)}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Status
              </h4>
              <p className="text-sm text-slate-900 capitalize">
                {resolution.status}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Privacy
              </h4>
              <p className="text-sm text-slate-900 capitalize">
                {resolution.privacy}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
