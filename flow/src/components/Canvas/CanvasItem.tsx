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
  containerRef: React.RefObject<HTMLDivElement | null>;
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
      try { node?.setPointerCapture(ev.pointerId); } catch {}
      dragging.current = true;
      const rect = node!.getBoundingClientRect();
      pointerOffset.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      node!.style.cursor = "grabbing";
      node!.style.zIndex = "9999";
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

      onChangePosition(
        item.instanceId,
        Math.round(clampedX * 100) / 100,
        Math.round(clampedY * 100) / 100
      );
    }

    function onPointerUp(ev: PointerEvent) {
      if (!dragging.current) return;
      dragging.current = false;
      try { node?.releasePointerCapture(ev.pointerId); } catch {}
      if (node) {
          node.style.cursor = "grab";
          node.style.zIndex = "auto";
      }

      const container = containerRef.current;
      if (!container) return;
      const crect = container.getBoundingClientRect();
      const rect = node!.getBoundingClientRect();

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

  // ESTILO DARK/TECH ATUALIZADO
  const style: React.CSSProperties = {
    position: "absolute",
    left: item.x,
    top: item.y,
    width: item.largura ?? 120,
    height: item.altura ?? 70,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    userSelect: "none",
    borderRadius: "8px",
    background: "linear-gradient(145deg, #1e293b, #0f172a)", 
    border: "1px solid #3b82f6", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    padding: "8px",
    touchAction: "none",
    color: "#ffffff",
    fontFamily: "sans-serif",
    fontSize: "0.9rem",
    textAlign: "center",
    transition: "box-shadow 0.2s",
  };

  return (
    <div ref={elRef} style={style} role="button" aria-label={item.nome ?? `maquina-${item.idMaquina}`}>
      {/* Um pequeno indicador visual (bolinha) */}
      <div style={{width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginBottom: 6}}></div>
      <div style={{ fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
        {item.nome ?? `Máquina ${item.idMaquina}`}
      </div>
    </div>
  );
}