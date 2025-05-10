Deno.cron("*/1 * * * *", () => {
  fetch("https://ntfy.sh/A", { method: "POST", body: "1" });
  return new Response("Job executed");
});
