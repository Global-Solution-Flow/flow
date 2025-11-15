import { useDroppable } from '@dnd-kit/core';

export function GridDroppable() {
  // 1. Hook do dnd-kit
  const { isOver, setNodeRef } = useDroppable({
    id: 'grid-canvas', // O ID único da área
  });

  // 2. Muda o estilo se estiver arrastando por cima
  const style = isOver
    ? 'border-green-500 bg-gray-700'
    : 'border-gray-600 bg-gray-800';

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full border-2 border-dashed rounded-lg transition-colors ${style}`}
    >
      <p className="p-4 text-gray-500">Arraste as máquinas para cá...</p>
      {/* Aqui você vai renderizar as máquinas que já estão no grid */}
    </div>
  );
}