import capture from "../../../../../docs/history/2026-10-30-path-paint-motion-before.json";
export function GET() {
  return new Response(JSON.stringify(capture), { headers: { "Content-Type": "application/json" } });
}
