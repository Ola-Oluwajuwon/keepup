"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MiniMap } from "./MiniMap";

interface DraggableCanvasProps {
  children: ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function DraggableCanvas({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
}: DraggableCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateViewportSize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        setViewportSize({
          width: newWidth,
          height: newHeight,
        });

        // Center the canvas on initial load
        if (!isInitializedRef.current && newWidth > 0 && newHeight > 0) {
          setPosition({
            x: -(canvasWidth - newWidth) / 2,
            y: -(canvasHeight - newHeight) / 2,
          });
          isInitializedRef.current = true;
        }
      }
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, [canvasWidth, canvasHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Constrain the position to keep canvas within bounds
    const maxX = 0;
    const minX = -(canvasWidth - viewportSize.width);
    const maxY = 0;
    const minY = -(canvasHeight - viewportSize.height);

    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {children}
        </div>
      </div>

      <MiniMap
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        viewportWidth={viewportSize.width}
        viewportHeight={viewportSize.height}
        viewportX={position.x}
        viewportY={position.y}
      />
    </>
  );
}
