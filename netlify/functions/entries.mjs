import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "entries", consistency: "strong" });

  // Public: anyone can read notices and updates
  if (req.method === "GET") {
    const { blobs } = await store.list();
    const rawItems = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }))
    );
    const items = rawItems.filter(Boolean);
    items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return Response.json(items);
  }

  // Everything below requires the server-side ADMIN_TOKEN
  const expectedToken = Netlify.env.get("ADMIN_TOKEN");
  if (!expectedToken) {
    return new Response("ADMIN_TOKEN is not configured on the server", { status: 500 });
  }

  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${expectedToken}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    const title = String(body?.title || "").trim();
    const details = String(body?.details || "").trim();
    if (!title || !details) {
      return new Response("Title and details are required", { status: 400 });
    }

    const id = crypto.randomUUID();
    const entry = {
      id,
      title: title.slice(0, 200),
      details: details.slice(0, 5000),
      createdAt: new Date().toISOString(),
    };
    await store.setJSON(id, entry);
    return Response.json(entry, { status: 201 });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return new Response("Missing id", { status: 400 });
    }
    await store.delete(id);
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/entries" };
