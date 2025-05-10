Deno.cron("Send BTC price every minute", "*/1 * * * *", async () => {
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCFDUSD");
  const data = await res.json();
  
  fetch("https://ntfy.sh/A", { method: "POST", body: data.price });
  return new Response(data.price);  // Menampilkan harga di respons
});
