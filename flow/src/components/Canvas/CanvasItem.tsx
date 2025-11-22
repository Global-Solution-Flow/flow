// src/components/CanvasItem.tsx
import React from "react";

export type CanvasItemType = {
  instanceId: string;
  idLtyMaquina?: number | null; 
  idMaquina: number;           
  nome?: string;               
  x: number;
  y: number;
  largura?: number;
  altura?: number;
};

type Props = {
  item: CanvasItemType;
  containerRef: React.RefObject<HTMLElement>;
  onChangePosition: (instanceId: string, x: number, y: number) => void;
  onDrop: (instanceId: string, x: number, y: number) => void;
};

export default function CanvasItem({ item, containerRef, onChangePosition, onDrop }: Props) {
  const elRef = React.useRef<HTMLDivElement | null>(null);
  const dragging = React.useRef(false);
  const pointerOffset = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const node = elRef.current;
    if (!node) return;

    function onPointerDown(ev: PointerEvent) {
      try { node.setPointerCapture(ev.pointerId); } catch {}
      dragging.current = true;
      const rect = node.getBoundingClientRect();
      pointerOffset.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      node.style.cursor = "grabbing";
    }

    function onPointerMove(ev: PointerEvent) {
      if (!dragging.current) return;
      const container = containerRef.current;
      if (!container) return;
      const crect = container.getBoundingClientRect();

      const rawX = ev.clientX - crect.left - pointerOffset.current.x;
      const rawY = ev.clientY - crect.top - pointerOffset.current.y;

      const maxX = Math.max(0, crect.width - (item.largura ?? 120));
      const maxY = Math.max(0, crect.height - (item.altura ?? 70));

      const clampedX = Math.min(Math.max(0, rawX), maxX);
      const clampedY = Math.min(Math.max(0, rawY), maxY);

      onChangePosition(item.instanceId, Math.round(clampedX * 100) / 100, Math.round(clampedY * 100) / 100);
    }

    function onPointerUp(ev: PointerEvent) {
      if (!dragging.current) return;
      dragging.current = false;
      try { node.releasePointerCapture(ev.pointerId); } catch {}
      node.style.cursor = "grab";

      const container = containerRef.current;
      if (!container) return;
      const crect = container.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      const finalX = Math.round((rect.left - crect.left) * 100) / 100;
      const finalY = Math.round((rect.top - crect.top) * 100) / 100;
      onDrop(item.instanceId, finalX, finalY);
    }

    node.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [containerRef, item, onChangePosition, onDrop]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: item.x,
    top: item.y,
    width: item.largura ?? 120,
    height: item.altura ?? 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    userSelect: "none",
    borderRadius: 8,
    boxShadow: "0 6px 12px rgba(0,0,0,0.18)",
    background: "linear-gradient(180deg,#f2f8ff,#e6f0ff)",
    border: "1px solid rgba(0,0,0,0.08)",
    padding: 6,
    touchAction: "none",
  };

  return (
    <div ref={elRef} style={style} role="button" aria-label={item.nome ?? `maquina-${item.idMaquina}`}>
      <div style={{ fontWeight: 700 }}>{item.nome ?? `Máquina ${item.idMaquina}`}</div>
    </div>
  );
}
