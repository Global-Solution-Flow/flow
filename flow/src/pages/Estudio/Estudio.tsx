import React, { useState } from "react";
import GridCanvas from "../../components/Canvas/GridCanvas";
import type { CanvasItemType } from "../../components/Canvas/CanvasItem.tsx"; // Ajuste se o arquivo for .ts ou .tsx
import {
  createLtyMaquina,
  updateLtyMaquina,
  getLayoutSalvoById
} from "../../api/LtyMaquinaApi";

/* Função auxiliar para gerar IDs únicos no front */
function generateInstanceId() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000).toString(36)}`;
}

/* Componente do Formulário */
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
    <div style={{ display: "grid", gap: 8 }}>
      <input
        placeholder="ID da Máquina (número)"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", color: "#FFFFFF" }}
      />
      <input
        placeholder="Nome (opcional)"
        value={inputNome}
        onChange={(e) => setInputNome(e.target.value)}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", color: "#FFFFFF" }}
      />
      <button
        onClick={handleAddClick}
        style={{ padding: 8, borderRadius: 6, background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}
      >
        Adicionar
      </button>
    </div>
  );
}

/* Componente Principal */
export default function Estudio() {
  const [items, setItems] = useState<CanvasItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [layoutIdToLoad, setLayoutIdToLoad] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Adicionar máquina manualmente (Mock ou real)
  const addMachineManual = (idMaquinaNumber: number, nome?: string) => {
    const inst: CanvasItemType = {
      instanceId: generateInstanceId(),
      idLtyMaquina: null,
      idMaquina: idMaquinaNumber,
      nome: nome ?? `Máquina ${idMaquinaNumber}`,
      x: 20,
      y: 20,
      largura: 120,
      altura: 70,
    };
    setItems((prev) => [...prev, inst]);
  };

  // Atualizar posição localmente (enquanto arrasta)
  const onChangePosition = (instanceId: string, x: number, y: number) => {
    setItems((prev) => prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y } : it)));
  };

  // Ao soltar (Salvar no banco)
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
    setStatus(null);
    try {
      if (item.idLtyMaquina == null) {
        // Criar novo
        const res: any = await createLtyMaquina(payload);
        // Tenta pegar o ID de várias formas possíveis caso a API mude
        const idFromApi: number | null = res?.idLtyMaquina ?? res?.id ?? null;
        setItems((prev) =>
          prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y, idLtyMaquina: idFromApi } : it))
        );
        setStatus("Criado e salvo no servidor.");
      } else {
        // Atualizar existente
        await updateLtyMaquina(payload);
        setItems((prev) => prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y } : it)));
        setStatus("Atualizado no servidor.");
      }
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setStatus(`Erro ao salvar: ${err?.message ?? JSON.stringify(err)}`);
      setItems((prev) => prev.map((it) => (it.instanceId === instanceId ? { ...it, x, y } : it)));
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // Carregar Layout
  const handleLoadLayout = async () => {
    const id = Number(layoutIdToLoad);
    if (!id) {
      setStatus("Informe um ID de layout válido.");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res: any = await getLayoutSalvoById(id);
      // Tenta encontrar a lista de máquinas na resposta
      const maquinas = res?.ltyMaquinas ?? res?.ltyMaquinaList ?? res?.maquinas ?? null;

      if (!Array.isArray(maquinas)) {
        setStatus("Layout carregado, mas sem máquinas ou formato inesperado.");
        console.warn("Resposta getLayoutSalvoById:", res);
        setItems([]);
      } else {
        const mapped: CanvasItemType[] = maquinas.map((m: any) => ({
          instanceId: generateInstanceId(),
          idLtyMaquina: m.idLtyMaquina ?? m.id ?? null,
          idMaquina: Number(m.idMaquina ?? m.idMaquinaFk ?? m.maquinaId ?? 0),
          nome: m.nmMaquina ?? m.nome ?? `Máquina ${m.idMaquina ?? m.id ?? ""}`,
          x: Number(m.positionX ?? m.posX ?? 0),
          y: Number(m.positionY ?? m.posY ?? 0),
          largura: Number(m.largura ?? 120),
          altura: Number(m.altura ?? 70),
        }));
        setItems(mapped);
        setStatus(`Layout carregado com ${mapped.length} máquinas.`);
      }
    } catch (err: any) {
      console.error("Erro ao carregar layout:", err);
      setStatus(`Erro ao carregar: ${err?.message ?? "Falha na requisição"}`);
      setItems([]);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#071025", color: "#fff" }}>
      {/* Painel Esquerdo: Controles */}
      <aside style={{ width: "22%", padding: 18, borderRight: "1px solid #1f2937" }}>
        <h3 style={{ marginBottom: 10 }}>Carregar Layout</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            placeholder="ID do layout"
            value={layoutIdToLoad}
            onChange={(e) => setLayoutIdToLoad(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #234", color: "#FFFFFF", width: "100%" }}
          />
          <button
            onClick={handleLoadLayout}
            disabled={loading}
            style={{ padding: 8, borderRadius: 6, cursor: "pointer", background: "#10b981", color: "white", border: "none" }}
          >
            {loading ? "..." : "Ir"}
          </button>
        </div>

        <hr style={{ borderColor: "#1f2937", margin: "16px 0" }} />

        <h4 style={{ marginBottom: 10 }}>Adicionar Máquina</h4>
        <AddMachineForm onAdd={addMachineManual} />

        <div style={{ marginTop: 20 }}>
          <strong>Status: </strong>
          <span style={{ color: saving ? "#fbbf24" : "#9ca3af" }}>{saving ? "Salvando..." : "Ocioso"}</span>
          {status && (
            <div style={{ marginTop: 8, padding: 8, background: "#064e3b", borderRadius: 6, fontSize: "0.85rem" }}>
              {status}
            </div>
          )}
        </div>
      </aside>

      {/* Área Central: Canvas */}
      <main style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginBottom: 10 }}>Estúdio de Otimização</h2>
        <div style={{ flex: 1, borderRadius: 8, background: "#1f2937", padding: 8, overflow: "hidden" }}>
          {/* O componente GridCanvas deve lidar com o Drag and Drop */}
          <GridCanvas items={items} onChangePosition={onChangePosition} onDrop={onDrop} />
        </div>
      </main>

      {/* Painel Direito: Infos */}
      <aside style={{ width: "20%", padding: 18, borderLeft: "1px solid #1f2937" }}>
        <h3>Resumo</h3>
        <div style={{ fontSize: 24, fontWeight: "bold", color: "#60a5fa" }}>{items.length}</div>
        <div style={{ color: "#9ca3af" }}>Máquinas no grid</div>
        
        <div style={{ marginTop: 30, fontSize: 13, color: "#d1d5db" }}>
          <p><strong>Instruções:</strong></p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Digite o ID de um layout existente para carregar.</li>
            <li>Adicione máquinas manuais se o banco estiver vazio.</li>
            <li>Arraste as máquinas para salvar a nova posição automaticamente.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}