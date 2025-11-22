// src/api/layoutMaquinaApi.ts
const BASE_URL = import.meta.env.VITE_API_FLOW;

export type LtyMaquinaPayload = {
  idLtyMaquina?: number | null;
  idMaquina: number;
  positionX: number;
  positionY: number;
};

async function parseResponse(res: Response) {
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) {
    const err: any = new Error((json && (json.message || json.error)) || res.statusText || "API error");
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export async function createLtyMaquina(payload: LtyMaquinaPayload) {
  const url = `${BASE_URL}/layout-maquina`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function updateLtyMaquina(payload: LtyMaquinaPayload) {
  const url = `${BASE_URL}/layout-maquina`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function getLtyMaquinaById(id: number) {
  const url = `${BASE_URL}/layout-maquina/${id}`;
  const res = await fetch(url, { method: "GET" });
  return parseResponse(res);
}

export async function deleteLtyMaquina(id: number) {
  const url = `${BASE_URL}/layout-maquina/delete/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return parseResponse(res);
}

/**
 * Novas funções para trabalhar com layouts salvos
 * (a resposta exata do backend pode variar; estou assumindo um formato padrão)
 */
export async function getLayoutSalvoById(layoutId: number) {
  const url = `${BASE_URL}/layouts-salvos/${layoutId}`;
  const res = await fetch(url, { method: "GET" });
  return parseResponse(res);
}

export async function createLayoutSalvo(payload: { nmLayout: string; idUsuario: number }) {
  const url = `${BASE_URL}/layouts-salvos`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function updateLayoutSalvo(payload: { idLtySalvo: number; nmLayout?: string; idUsuario?: number }) {
  const url = `${BASE_URL}/layouts-salvos`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}
