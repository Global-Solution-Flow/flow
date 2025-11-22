// src/pages/Estudio/Estudio.tsx
import React from "react";
import GridCanvas from "../../components/Canvas/GridCanvas.tsx";
import type { CanvasItemType } from "../../components/Canvas/CanvasItem.tsx";
import {
  createLtyMaquina,
  updateLtyMaquina,
  getLayoutSalvoById
} from "../../api/LtyMaquinaApi.ts";

/* generate id */
function generateInstanceId() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000).toString(36)}`;
}

export default function Estudio() {
  const [items, setItems] = React.useState<CanvasItemType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [layoutIdToLoad, setLayoutIdToLoad] = React.useState<string>("");
  const [status, setStatus] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // remove any local mocks: add machine by explicit idMaquina + optional nome
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
    setItems(prev => [...prev, inst]);
  };

  const onChangePosition = (instanceId: string, x: number, y: number) =>
    setItems(prev => prev.map(it => it.instanceId === instanceId ? { ...it, x, y } : it));

  const onDrop = async (instanceId: string, x: number, y: number) => {
    const item = items.find(it => it.instanceId === instanceId);
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
        const res: any = await createLtyMaquina(payload);
        const idFromApi: number | null = res?.idLtyMaquina ?? res?.id ?? null;
        setItems(prev => prev.map(it => it.instanceId === instanceId ? { ...it, x, y, idLtyMaquina: idFromApi } : it));
        setStatus("Criado e salvo no servidor.");
      } else {
        await updateLtyMaquina(payload);
        setItems(prev => prev.map(it => it.instanceId === instanceId ? { ...it, x, y } : it));
        setStatus("Atualizado no servidor.");
      }
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setStatus(`Erro ao salvar: ${err?.message ?? JSON.stringify(err)}`);
      setItems(prev => prev.map(it => it.instanceId === instanceId ? { ...it, x, y } : it));
    } finally {
      setSaving(false);
      window.setTimeout(() => setStatus(null), 3000);
    }
  };

  
  const handleLoadLayout = async () => {
    const id = Number(layoutIdToLoad);
    if (!id) {
      setStatus("Informe um id de layout válido.");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res: any = await getLayoutSalvoById(id);
      const maquinas = res?.ltyMaquinas ?? res?.ltyMaquinaList ?? res?.maquinas ?? null;
      if (!Array.isArray(maquinas)) {
        setStatus("Resposta do servidor inesperada. Me envie o JSON e eu ajusto.");
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
        setStatus(`Layout carregado: ${mapped.length} máquinas.`);
      }
    } catch (err: any) {
      console.error("Erro ao carregar layout:", err);
      setStatus(`Erro ao carregar layout: ${err?.message ?? JSON.stringify(err)}`);
      setItems([]);
    } finally {
      setLoading(false);
      window.setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#071025", color: "#fff" }}>
      <aside style={{ width: "22%", padding: 18 }}>
        <h3>Carregar layout salvo</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            placeholder="ID do layout"
            value={layoutIdToLoad}
            onChange={e => setLayoutIdToLoad(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #234" }}
          />
          <button onClick={handleLoadLayout} disabled={loading} style={{ padding: 8, borderRadius: 6 }}>
            {loading ? "Carregando..." : "Carregar"}
          </button>
        </div>

        <hr style={{ borderColor: "#102" }} />

        <h4>Adicionar máquina manual</h4>
        <AddMachineForm onAdd={(id, nome) => addMachineManual(id, nome)} />

        <div style={{ marginTop: 12 }}>
          <strong>Status:</strong>
          <div>{saving ? "Salvando..." : "Ocioso"}</div>
          {status && <div style={{ marginTop: 8, padding: 8, background: "#012b2b", borderRadius: 6 }}>{status}</div>}
        </div>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#1f2937", padding: 8 }}>
          <GridCanvas items={items} onChangePosition={onChangePosition} onDrop={onDrop} />
        </div>
      </main>

      <aside style={{ width: "22%", padding: 18 }}>
        <h3>Painel</h3>
        <div>{items.length} máquinas no canvas</div>
        <div style={{ marginTop: 12, fontSize: 13 }}>
          <p>Observações:</p>
          <ul>
            <li>Tudo persistido somente no banco através dos endpoints.</li>
            <li>Sem mocks locais — apenas dados vindos do backend ou inseridos manualmente.</li>
            <li>Se a resposta do GET `/layouts-salvos/{id}` tiver outro formato, cole o JSON aqui e eu corrijo automaticamente.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* Pequeno form para adicionar máquina por id */
function AddMachineForm({ onAdd }: { onAdd: (idMaquina: number, nome?: string) => void }) {
  const [id, setId] = React.useState("");
  const [nome, setNome] = React.useState("");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input placeholder="idMaquina (número)" value={id} onChange={e => setId(e.target.value)} style={{ padding: 8, borderRadius: 6 }} />
      <input placeholder="nome (opcional)" value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 8, borderRadius: 6 }} />
      <button onClick={() => { const n = Number(id); if (!n) return; onAdd(n, nome || undefined); setId(""); setNome(""); }} style={{ padding: 8, borderRadius: 6 }}>
        Adicionar
      </button>
    </div>
  );
}
