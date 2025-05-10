Deno.cron("*/1 * * * *", () => {
  fetch("https://ntfy.sh/A", { method: "POST", body: "1" });
  return new Response("Cron job executed");
});

addEventListener("fetch", (event) => {
  event.respondWith(new Response("OK"));
});
