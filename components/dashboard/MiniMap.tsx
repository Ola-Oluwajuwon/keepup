"use client";

interface MiniMapProps {
  // Total canvas dimensions
  canvasWidth: number;
  canvasHeight: number;
  // Viewport dimensions and position
  viewportWidth: number;
  viewportHeight: number;
  viewportX: number;
  viewportY: number;
  // Scale factor for the minimap (e.g., 0.1 means 10% of actual size)
  scale?: number;
}

export function MiniMap({
  canvasWidth,
  canvasHeight,
  viewportWidth,
  viewportHeight,
  viewportX,
  viewportY,
  scale = 0.1,
}: MiniMapProps) {
  const minimapWidth = canvasWidth * scale;
  const minimapHeight = canvasHeight * scale;
  const viewportRectX = Math.abs(viewportX) * scale;
  const viewportRectY = Math.abs(viewportY) * scale;
  const viewportRectWidth = viewportWidth * scale;
  const viewportRectHeight = viewportHeight * scale;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="border-2 border-slate-300 bg-slate-100 rounded-lg overflow-hidden shadow-lg"
        style={{
          width: `${minimapWidth}px`,
          height: `${minimapHeight}px`,
        }}
      >
        {/* Gray background represents total canvas */}
        <div className="relative w-full h-full bg-slate-300">
          {/* White rectangle represents visible viewport */}
          <div
            className="absolute bg-white border border-slate-500 opacity-80"
            style={{
              left: `${viewportRectX}px`,
              top: `${viewportRectY}px`,
              width: `${viewportRectWidth}px`,
              height: `${viewportRectHeight}px`,
            }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center mt-1">Map</p>
    </div>
  );
}
