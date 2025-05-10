Deno.cron("BTC/FDUSD every minute", "*/1 * * * *", () => fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCFDUSD")
  .then(r => r.json())
  .then(d => fetch("https://ntfy.sh/A", { method: "POST", body: `${d.price}` })));
