/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import GridCanvas from "../../components/Canvas/GridCanvas";
import type { CanvasItemType } from "../../components/Canvas/CanvasItem";
import {
  createLtyMaquina,
  updateLtyMaquina,
  getLayoutSalvoById
} from "../../api/LtyMaquinaApi";

function generateInstanceId() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000).toString(36)}`;
}

function AddMachineForm({ onAdd }: { onAdd: (idMaquina: number, nome?: string) => void }) {
  const [inputId, setInputId] = useState("");
  const [inputNome, setInputNome] = useState("");

  const handleAddClick = () => {
    const n = Number(inputId);
    if (!n) {
      alert("Por favor, insira um ID numérico válido.");
      return;
    }
    onAdd(n, inputNome || undefined);
    setInputId("");
    setInputNome("");
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
            <label className="text-xs text-gray-400 uppercase font-bold">ID</label>
            <input
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 text-white focus:border-blue-500 outline-none"
            placeholder="Ex: 1"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            />
        </div>
        <div>
            <label className="text-xs text-gray-400 uppercase font-bold">Nome</label>
            <input
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 text-white focus:border-blue-500 outline-none"
            placeholder="Prensa"
            value={inputNome}
            onChange={(e) => setInputNome(e.target.value)}
            />
        </div>
      </div>
      <button
        onClick={handleAddClick}
        className="w-full p-2 mt-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg"
      >
        + Adicionar
      </button>
    </div>
  );
}

export default function Estudio() {
  const [items, setItems] = useState<CanvasItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [layoutIdToLoad, setLayoutIdToLoad] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [tempoTotal, setTempoTotal] = useState(0);
  const [gargalo, setGargalo] = useState("Nenhum");
  const [modoIA, setModoIA] = useState<"OFFLINE" | "CONECTADO">("OFFLINE");

  // Pega a URL do .env (ou usa fallback seguro)
  const API_URL = import.meta.env.VITE_API_FLOW || "https://flow-fkxo.onrender.com";

  useEffect(() => {
    if (items.length === 0) {
      setTempoTotal(0);
      setGargalo("Nenhum");
      setModoIA("OFFLINE");
      return;
    }

    let active = true;

    const runAnalysis = async () => {
      try {
        // TENTATIVA REAL: Chama o backend Java
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const payload = {
            maquinas: items.map(i => ({ id: i.idMaquina, nome: i.nome }))
        };

        // Tenta acessar no endpoint padrão
        const response = await fetch(`${API_URL}/analisar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        
        if (active) {
          setTempoTotal(Number(data.tempo_ciclo_total?.toFixed(2)) || 0);
          setGargalo(data.maquina_gargalo_id ? `Máq. ID ${data.maquina_gargalo_id}` : "Desconhecido");
          setModoIA("CONECTADO");
        }

      } catch (error) {
        // FALLBACK:
        if (active) {
          console.warn("Usando simulação (IA Offline).", error);
          const baseTime = 120;
          const variation = Math.random() * 5;
          const novoTempo = baseTime + (items.length * 45.5) + variation;
          
          setTempoTotal(Number(novoTempo.toFixed(2)));
          const randomItem = items[Math.floor(Math.random() * items.length)];
          setGargalo(randomItem.nome || `Máq ${randomItem.idMaquina}`);
          
          setModoIA("OFFLINE"); 
        }
      }
    };

    const timer = setTimeout(runAnalysis, 600);
    return () => { active = false; clearTimeout(timer); };
  }, [items]);

  // --- CRUD DO LAYOUT ---
  const addMachineManual = (idMaquinaNumber: number, nome?: string) => {
    const inst: CanvasItemType = {
      instanceId: generateInstanceId(),
      idLtyMaquina: null,
      idMaquina: idMaquinaNumber,
      nome: nome ?? `Máq. ${idMaquinaNumber}`,
      x: 50 + (items.length * 20),
      y: 50 + (items.length * 20),
      largura: 140,
      altura: 80,
    };
    setItems((prev) => [...prev, inst]);
  };

  const onChangePosition = (instanceId: string, x: number, y: number) => {
    setItems((prev) => prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y } : it)));
  };

  const onDrop = async (instanceId: string, x: number, y: number) => {
    const item = items.find((it) => it.instanceId === instanceId);
    if (!item) return;

    const payload = {
      idLtyMaquina: item.idLtyMaquina ?? null,
      idMaquina: Number(item.idMaquina),
      positionX: Number(x),
      positionY: Number(y),
    };

    setSaving(true);
    try {
      if (item.idLtyMaquina == null) {
        const res: any = await createLtyMaquina(payload);
        const idFromApi = res?.idLtyMaquina ?? res?.id ?? null;
        setItems((prev) =>
          prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y, idLtyMaquina: idFromApi } : it))
        );
        setStatus("Salvo!");
      } else {
        await updateLtyMaquina(payload);
        setStatus("Atualizado!");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("Erro Conexão (Banco)");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const handleLoadLayout = async () => {
    const id = Number(layoutIdToLoad);
    if (!id) { alert("ID inválido"); return; }
    setLoading(true);
    setStatus(null);
    try {
      const res: any = await getLayoutSalvoById(id);
      const maquinas = res?.ltyMaquinas ?? res?.ltyMaquinaList ?? res?.maquinas ?? [];
      if (Array.isArray(maquinas) && maquinas.length > 0) {
        const mapped: CanvasItemType[] = maquinas.map((m: any) => ({
          instanceId: generateInstanceId(),
          idLtyMaquina: m.idLtyMaquina ?? m.id,
          idMaquina: Number(m.idMaquina ?? m.idMaquinaFk ?? 0),
          nome: m.nmMaquina ?? m.nome ?? `Máq ${m.idMaquina}`,
          x: Number(m.positionX ?? m.posX ?? 20),
          y: Number(m.positionY ?? m.posY ?? 20),
          largura: 140,
          altura: 80,
        }));
        setItems(mapped);
        setStatus(`Layout ${id} carregado!`);
      } else {
        setStatus("Layout vazio.");
        setItems([]);
      }
    } catch (err: any) {
      console.error("Erro ao carregar:", err);
      // FALLBACK LAYOUT SIMULADO
      const layoutFake = [
          { instanceId: 'fake1', idLtyMaquina: 1, idMaquina: 1, nome: "Prensa", x: 100, y: 100, largura: 140, altura: 80 },
          { instanceId: 'fake2', idLtyMaquina: 2, idMaquina: 2, nome: "CNC", x: 300, y: 100, largura: 140, altura: 80 }
      ];
      setItems(layoutFake);
      setStatus("Layout carregado (Modo Offline)");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white font-sans overflow-auto lg:overflow-hidden">
      
      {/* ESQUERDA */}
      <aside className="w-full lg:w-80 bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 p-6 flex flex-col gap-6 shadow-2xl z-10 order-2 lg:order-1">
        <div>
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">Projeto</h3>
          <div className="flex gap-2">
            <input
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-white placeholder-gray-400"
              placeholder="ID Layout"
              value={layoutIdToLoad}
              onChange={(e) => setLayoutIdToLoad(e.target.value)}
            />
            <button
              onClick={handleLoadLayout}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Ir"}
            </button>
          </div>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div>
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">Biblioteca</h3>
          <AddMachineForm onAdd={addMachineManual} />
        </div>
        <div className="mt-auto hidden lg:block">
          {status && (
            <div className="p-3 bg-gray-900 border border-green-500 text-green-400 text-sm rounded shadow-lg animate-pulse">{status}</div>
          )}
        </div>
      </aside>

      {/* CENTRO */}
      <main className="flex-1 p-4 lg:p-6 bg-gray-900 relative flex flex-col order-1 lg:order-2">
        <div className="flex justify-between items-end mb-2 lg:mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded"></span>
              Grid de Produção
            </h2>
            <div className="text-right lg:hidden">
                <span className={saving ? "text-yellow-400 text-xs" : "text-green-400 text-xs"}>
                    {saving ? "Salvando..." : "Online"}
                </span>
            </div>
        </div>
        <div className="w-full h-[500px] lg:flex-1 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 overflow-hidden relative shadow-inner">
          <GridCanvas items={items} onChangePosition={onChangePosition} onDrop={onDrop} />
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 select-none pointer-events-none p-4 text-center">
              <div className="text-4xl lg:text-6xl mb-4 opacity-20">🏗️</div>
              <p className="text-lg font-medium">Grid Vazio</p>
              <p className="text-sm opacity-70">Adicione máquinas no painel.</p>
            </div>
          )}
        </div>
      </main>

      {/* DIREITA */}
      <aside className="w-full lg:w-80 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 p-6 shadow-2xl z-10 order-3">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">Análise IA</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                modoIA === "CONECTADO" ? "bg-green-900/30 border-green-500 text-green-400" : "bg-yellow-900/30 border-yellow-500 text-yellow-400"
            }`}>
                {modoIA === "CONECTADO" ? "LIVE API" : "SIMULADO"}
            </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
          <div className="bg-gray-700 p-4 lg:p-5 rounded-xl border border-gray-600 shadow-lg relative overflow-hidden">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tempo Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-4xl font-mono font-bold text-white tracking-tighter">{tempoTotal}</span>
              <span className="text-xs lg:text-sm text-gray-400 font-medium">seg</span>
            </div>
            <div className="w-full bg-gray-600 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((tempoTotal / 500) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 lg:p-5 rounded-xl border border-gray-600 shadow-lg relative overflow-hidden">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Gargalo</p>
            <div className="text-lg lg:text-xl font-bold text-red-400 wrap-break-word">{gargalo}</div>
            <p className="text-[10px] lg:text-xs text-gray-500 mt-2 lg:mt-3 leading-relaxed">Detectado risco de fila neste ponto.</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
             <p className="text-xs text-gray-500">Integrated with Render & Oracle</p>
        </div>
      </aside>
    </div>
  );
}