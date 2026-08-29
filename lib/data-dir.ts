import path from "node:path";

export function dataDir() {
  if (process.env.VERCEL) return path.join("/tmp", "ths-llm");
  return path.join(process.cwd(), "data");
}
