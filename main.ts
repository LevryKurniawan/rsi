Deno.cron("Send BTC price every minute", "*/1 * * * *", async () => {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCFDUSD");
    const data = await res.json();
    
    console.log(`BTC/FDUSD Price: ${data.price}`);  // Debug log harga
    await fetch("https://ntfy.sh/A", { method: "POST", body: data.price });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
