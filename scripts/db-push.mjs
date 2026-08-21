import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const envPath = path.resolve(process.cwd(), ".env");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const TOKEN = env.SUPABASE_ACCESS_TOKEN;
const REF = env.SUPABASE_PROJECT_REF;
if (!TOKEN || !REF) {
  console.error("Faltam SUPABASE_ACCESS_TOKEN / SUPABASE_PROJECT_REF no .env");
  process.exit(1);
}

const dir = path.resolve(process.cwd(), "supabase/migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

for (const f of files) {
  const sql = fs.readFileSync(path.join(dir, f), "utf8");
  process.stdout.write(`Aplicando ${f}... `);
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`FALHOU (${res.status})\n${body}`);
    process.exit(1);
  }
  console.log("ok");
}
console.log("Todas as migrations aplicadas.");
