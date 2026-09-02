export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { restoreLmsDatabase } = await import("@/lib/db-cloud");
  await restoreLmsDatabase();
}
