// src/data/MOCK_MAQUINAS.ts
export type Maquina = {
  id: string;  
  nome: string;
  largura?: number;  
  altura?: number;   
  apiId: number;     
};

export const MOCK_MAQUINAS: Maquina[] = [
  { id: "esteira", nome: "Esteira Profissional", largura: 140, altura: 70, apiId: 1 },
  { id: "supino",  nome: "Supino Reto",         largura: 120, altura: 70, apiId: 2 },
  { id: "cross",   nome: "Cross Over",          largura: 130, altura: 70, apiId: 3 },
];
