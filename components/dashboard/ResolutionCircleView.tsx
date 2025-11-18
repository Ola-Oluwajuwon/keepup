"use client";

import { useState } from "react";
import type { Resolution } from "@/types";
import { ResolutionCardCompact } from "./ResolutionCardCompact";
import { ResolutionDetailModal } from "./ResolutionDetailModal";
import { User } from "lucide-react";

interface ResolutionCircleViewProps {
  resolutions: Resolution[];
}

export function ResolutionCircleView({
  resolutions,
}: ResolutionCircleViewProps) {
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Canvas center (where avatar will be)
  const centerX = 1000;
  const centerY = 1000;
  const avatarRadius = 80;

  // Radius of the circle on which cards are placed
  const circleRadius = 400;

  // Calculate positions for each resolution card in a circle
  // Starting at 12 o'clock (top) and moving clockwise
  const getCardPosition = (index: number, total: number) => {
    // Start at -90 degrees (12 o'clock position)
    // Negative because we go clockwise in standard coordinates
    const angleStep = (2 * Math.PI) / total;
    const angle = -Math.PI / 2 + index * angleStep;

    return {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle),
    };
  };

  const handleOpenDetail = (resolution: Resolution) => {
    setSelectedResolution(resolution);
    setModalOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-full">
        {/* SVG for connection lines - positioned absolutely to cover entire canvas */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: "2000px",
            height: "2000px",
            zIndex: 1,
          }}
        >
          {resolutions.map((resolution, index) => {
            const cardPos = getCardPosition(index, resolutions.length);
            // Card center (cards are 192px wide, 120px tall approximately)
            const cardCenterX = cardPos.x + 96;
            const cardCenterY = cardPos.y + 60;

            return (
              <g key={resolution.id}>
                {/* Connection path */}
                <path
                  d={`M ${cardCenterX} ${cardCenterY} L ${centerX} ${centerY}`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                />

                {/* Animated dot */}
                <circle r="4" fill="#475569">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${cardCenterX} ${cardCenterY} L ${centerX} ${centerY}`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Avatar at center */}
        <div
          className="absolute flex items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900 shadow-2xl border-4 border-white"
          style={{
            left: `${centerX - avatarRadius}px`,
            top: `${centerY - avatarRadius}px`,
            width: `${avatarRadius * 2}px`,
            height: `${avatarRadius * 2}px`,
            zIndex: 10,
          }}
        >
          <User className="w-16 h-16 text-white" />
        </div>

        {/* Resolution cards positioned in circle */}
        {resolutions.map((resolution, index) => {
          const { x, y } = getCardPosition(index, resolutions.length);

          return (
            <div
              key={resolution.id}
              className="absolute"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                zIndex: 20,
              }}
            >
              <ResolutionCardCompact
                resolution={resolution}
                onOpenDetail={() => handleOpenDetail(resolution)}
              />
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <ResolutionDetailModal
        resolution={selectedResolution}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
