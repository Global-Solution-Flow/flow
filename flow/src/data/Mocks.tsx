
// Baseado na T_MAQUINA
export interface Maquina {
  id: number;
  nome: string;
  tempoCicloSeg: number;
  descricao: string | null;
  // --- Apenas Front-End ---
  imageUrl: string; // Um ícone para a biblioteca
}

// Baseado na T_LAYOUT_MAQUINA
export interface MaquinaPosicionada {
  maquinaId: number;
  posX: number;
  posY: number;
}

// O que a API Python (IA) vai retornar
export interface PredicaoIA {
  tempoCicloTotal: number;
  maquinaGargaloId: number | null;
}


//  (MOCKS)


// Mock para a "Biblioteca de Máquinas"
export const MOCK_MAQUINAS: Maquina[] = [
  {
    id: 1,
    nome: 'Prensa Hidráulica',
    tempoCicloSeg: 90.5,
    descricao: 'Prensa de 30 toneladas.',
    imageUrl: '/icons/prensa.svg', // Você precisará criar/baixar esses ícones
  },
  {
    id: 2,
    nome: 'Corte CNC',
    tempoCicloSeg: 240.0,
    descricao: 'Corte a laser de alta precisão.',
    imageUrl: '/icons/cnc.svg',
  },
  {
    id: 3,
    nome: 'Estação de Solda',
    tempoCicloSeg: 132.0,
    descricao: 'Solda automatizada.',
    imageUrl: '/icons/solda.svg',
  },
];

// Mock da Resposta da IA (baseado nos dados acima)
export const MOCK_PREDICAO: PredicaoIA = {
  tempoCicloTotal: 462.5, // A soma dos 3 tempos
  maquinaGargaloId: 2, // A "Corte CNC" é o gargalo (maior tempo)
};