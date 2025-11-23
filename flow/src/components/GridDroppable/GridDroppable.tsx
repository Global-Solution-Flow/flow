/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDroppable } from "@dnd-kit/core";
import CanvasItem from "../Canvas/CanvasItem"; 

export function GridDroppable({ items, onChangePosition, onDrop }: { items: any[], onChangePosition: any, onDrop: any }) {
  const { setNodeRef } = useDroppable({
    id: "grid-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      id="grid-canvas"
      className="relative w-full h-full bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 overflow-hidden shadow-inner"
    >
      {items.map((item) => (
        <CanvasItem
          key={item.instanceId}
          item={item}
          containerRef={{ current: document.getElementById("grid-canvas") } as any}
          onChangePosition={onChangePosition}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}