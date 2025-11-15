import { useState } from 'react';
import { MOCK_MAQUINAS, MOCK_PREDICAO } from '../../data/Mocks.tsx';
import type { Maquina, PredicaoIA } from '../../data/Mocks.tsx';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';

import { MaquinaDraggable } from '../../components/MaquinaDraggable/MaquinaDraggable.tsx';
import { GridDroppable } from '../../components/GridDroppable/GridDroppable.tsx';

export function Estudio() {
  const [biblioteca] = useState<Maquina[]>(MOCK_MAQUINAS);
  const [predicao] = useState<PredicaoIA>(MOCK_PREDICAO);

  // 2. Crie a função que será chamada QUANDO você soltar um item
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // 'active' é o item que você arrastou
    // 'over' é a área onde você soltou
    if (over && over.id === 'grid-canvas') {
      console.log('Você soltou a máquina!', active.id);
      //
      // AQUI você vai:
      // 1. Adicionar a máquina (active.id) ao seu "grid"
      // 2. Chamar a API de predição da IA
      //
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Coluna 1: Biblioteca (Atualizada) */}
        <aside className="w-full md:w-1/4 h-full p-4 bg-gray-800 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Biblioteca de Máquinas</h2>
          <div className="flex flex-col gap-4">
            {biblioteca.map((maquina) => (
              <MaquinaDraggable key={maquina.id} maquina={maquina} />
            ))}
          </div>
        </aside>

        {/* Coluna 2: O Grid (Atualizado) */}
        <main className="w-full md:w-1/2 h-full p-4">
          <GridDroppable />
        </main>

        {/* Coluna 3: Dashboard da IA */}
        <aside className="w-full md:w-1/4 h-full p-4 bg-gray-800">
          {/* ... (O dashboard da IA) ... */}
        </aside>
      </div>
    </DndContext>
  );
}