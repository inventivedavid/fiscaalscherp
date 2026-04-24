// Minimalistische Baserow REST client.
// Docs: https://api.baserow.io/api/redoc/
//
// We gebruiken `?user_field_names=true` overal — dan werken we met mensvriendelijke
// veldnamen i.p.v. numerieke field_IDs. Dit houdt de code leesbaar en migreerbaar.

const BASE_URL = process.env.BASEROW_API_URL ?? "https://api.baserow.io";
const TOKEN = process.env.BASEROW_TOKEN;

function requireToken() {
  if (!TOKEN) {
    throw new Error(
      "BASEROW_TOKEN is niet geconfigureerd. Voeg hem toe aan je Vercel Environment Variables.",
    );
  }
  return TOKEN;
}

async function request<T>(
  path: string,
  init: RequestInit & { tag?: string } = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Token ${requireToken()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    // Writes mogen nooit gecached worden; reads kiezen zelf.
    cache: init.cache ?? "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Baserow ${init.method ?? "GET"} ${path} faalde: ${res.status} ${body}`,
    );
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type BaserowRow = { id: number } & Record<string, unknown>;

export const baserow = {
  async createRow<T extends BaserowRow>(
    tableId: string,
    fields: Record<string, unknown>,
  ): Promise<T> {
    return request<T>(
      `/api/database/rows/table/${tableId}/?user_field_names=true`,
      {
        method: "POST",
        body: JSON.stringify(fields),
      },
    );
  },

  async updateRow<T extends BaserowRow>(
    tableId: string,
    rowId: number,
    fields: Record<string, unknown>,
  ): Promise<T> {
    return request<T>(
      `/api/database/rows/table/${tableId}/${rowId}/?user_field_names=true`,
      {
        method: "PATCH",
        body: JSON.stringify(fields),
      },
    );
  },

  async listRows<T extends BaserowRow>(
    tableId: string,
    params: {
      search?: string;
      filter?: string; // bv. "filter__field_email__equal=..."
      size?: number;
      orderBy?: string;
    } = {},
  ): Promise<{ count: number; results: T[] }> {
    const sp = new URLSearchParams({ user_field_names: "true" });
    if (params.size) sp.set("size", String(params.size));
    if (params.orderBy) sp.set("order_by", params.orderBy);
    if (params.search) sp.set("search", params.search);
    const filter = params.filter ? `&${params.filter}` : "";
    return request(
      `/api/database/rows/table/${tableId}/?${sp.toString()}${filter}`,
      { method: "GET" },
    );
  },
};

export const TABLES = {
  scans: () => process.env.BASEROW_SCANS_TABLE_ID ?? "",
  findings: () => process.env.BASEROW_FINDINGS_TABLE_ID ?? "",
  events: () => process.env.BASEROW_EVENTS_TABLE_ID ?? "",
};
