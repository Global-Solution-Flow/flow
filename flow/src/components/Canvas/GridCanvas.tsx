// src/components/GridCanvas.tsx
import React from "react";
import CanvasItem, { CanvasItemType } from "./CanvasItem";

type Props = {
  items: CanvasItemType[];
  onChangePosition: (instanceId: string, x: number, y: number) => void;
  onDrop: (instanceId: string, x: number, y: number) => void;
};

export default function GridCanvas({ items, onChangePosition, onDrop }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      id="grid-canvas"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    >
      {items.map((it) => (
        <CanvasItem
          key={it.instanceId}
          item={it}
          containerRef={containerRef}
          onChangePosition={onChangePosition}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
