import { useState } from 'react';
import { MOCK_MAQUINAS, MOCK_PREDICAO } from '../../data/Mocks.tsx';
import type { Maquina, PredicaoIA } from '../../data/Mocks.tsx';

export function Estudio() {

  const [biblioteca] = useState<Maquina[]>(MOCK_MAQUINAS);
  const [predicao] = useState<PredicaoIA>(MOCK_PREDICAO);

  const gargalo = biblioteca.find(
    (m) => m.id === predicao.maquinaGargaloId,
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      {/* Coluna 1: Biblioteca de Máquinas */}
      <aside className="w-full md:w-1/4 h-full p-4 bg-gray-800 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Biblioteca de Máquinas</h2>
        <div className="flex flex-col gap-4">
          {biblioteca.map((maquina) => (
            <div
              key={maquina.id}
              className="p-3 bg-gray-700 rounded-lg cursor-grab hover:bg-blue-600 transition-colors"
            >
              <h3 className="font-semibold">{maquina.nome}</h3>
              <p className="text-sm text-gray-300">
                Tempo: {maquina.tempoCicloSeg}s
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Coluna 2: O Grid (Canvas) */}
      <main className="w-full md:w-1/2 h-full p-4">
        <div className="w-full h-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg">
          <p className="p-4 text-gray-500">
            Arraste as máquinas para cá...
          </p>
        </div>
      </main>

      {/* Coluna 3: Dashboard da IA */}
      <aside className="w-full md:w-1/4 h-full p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Análise da IA</h2>
        <div className="p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold">Tempo de Ciclo Total:</h3>
          <p className="text-3xl font-bold text-blue-400">
            {predicao.tempoCicloTotal} segundos
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold">Alerta de Gargalo:</h3>
          {gargalo ? (
            <p className="text-2xl font-bold text-red-400">{gargalo.nome}</p>
          ) : (
            <p className="text-xl font-bold text-green-400">Nenhum Gargalo</p>
          )}
        </div>
      </aside>
    </div>
  );
}