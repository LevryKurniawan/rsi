Deno.cron("*/1 * * * *", () => fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=fdusd")
  .then(r => r.json())
  .then(d => fetch("https://ntfy.sh/A", { method: "POST", body: `${d.bitcoin.fdusd}` })));
