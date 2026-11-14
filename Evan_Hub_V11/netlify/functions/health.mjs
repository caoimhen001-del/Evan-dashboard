// Receives Garmin data (Garmin Connect -> Apple Health -> iPhone Shortcut) and serves it to the hub.
// Needs Netlify env var HEALTH_TOKEN.
// POST JSON: { date:"yyyy-MM-dd", steps, sleepHours, workoutMinutes, yesterdaySteps }  (all but date optional)
// GET: returns the last 60 days.
import { getStore } from "@netlify/blobs";

const num = (v) => (v === undefined || v === null || v === "" || isNaN(+v) ? null : Math.round(+v * 10) / 10);
const prevDay = (d) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() - 1); return x.toISOString().slice(0, 10); };

export default async (req) => {
  const token = process.env.HEALTH_TOKEN;
  if (!token || req.headers.get("x-token") !== token) return new Response("Unauthorised", { status: 401 });
  const store = getStore("health");
  const data = (await store.get("days", { type: "json" })) || {};

  if (req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) return new Response("Bad date", { status: 400 });
    const at = new Date().toISOString();
    const merge = (day, patch) => {
      const cur = data[day] || {};
      const out = { ...cur, at };
      // steps only ever go up within a day (protects against a stale Health read)
      if (patch.steps !== null && patch.steps !== undefined) out.steps = Math.max(cur.steps || 0, patch.steps);
      for (const k of ["sleepHours", "workoutMinutes"]) if (patch[k] !== null && patch[k] !== undefined) out[k] = patch[k];
      data[day] = out;
    };
    merge(b.date, { steps: num(b.steps), sleepHours: num(b.sleepHours), workoutMinutes: num(b.workoutMinutes) });
    if (num(b.yesterdaySteps) !== null) merge(prevDay(b.date), { steps: num(b.yesterdaySteps) });
    const keep = Object.keys(data).sort().slice(-60);
    await store.setJSON("days", Object.fromEntries(keep.map((k) => [k, data[k]])));
    return Response.json({ ok: true, saved: data[b.date] });
  }
  return Response.json(data);
};
