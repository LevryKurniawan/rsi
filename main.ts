Deno.cron("*/1 * * * *", async () => {
  await fetch("https://ntfy.sh/A", { method: "POST", body: "1" });
  return new Response("Job executed");
});
