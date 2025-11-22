import { useDroppable } from "@dnd-kit/core";
import { MaquinaDraggable } from "../MaquinaDraggable/MaquinaDraggable";

export function GridDroppable({ items }) {
  const { setNodeRef } = useDroppable({
    id: "grid-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      id="grid-canvas"
      className="relative w-full h-full bg-gray-700 rounded-lg border border-gray-500"
    >
      {items.map((item) => (
        <div
          key={item.id + item.x + item.y}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="bg-blue-300 text-black px-3 py-2 rounded-lg shadow-lg">
            {item.nome}
          </div>
        </div>
      ))}
    </div>
  );
}
