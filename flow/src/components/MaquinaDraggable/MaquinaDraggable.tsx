import { useDraggable } from '@dnd-kit/core';
import type { Maquina } from '../../data/Mocks.tsx';

interface Props {
  maquina: Maquina;
}

export function MaquinaDraggable({ maquina }: Props) {

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: maquina.id, 
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-3 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-600 transition-colors"
    >
      <h3 className="font-semibold">{maquina.nome}</h3>
      <p className="text-sm text-gray-300">Tempo: {maquina.tempoCicloSeg}s</p>
    </div>
  );
}