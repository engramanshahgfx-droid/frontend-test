import { del } from "@vercel/blob";

export async function POST(req) {
  try {
    const { path } = await req.json();

    if (!path) {
      return new Response(JSON.stringify({ error: "path is required" }), {
        status: 400,
      });
    }

    await del(path);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
