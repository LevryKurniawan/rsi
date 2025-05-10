Deno.cron("Send BTC price every minute", "*/1 * * * *", async () => {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");  // Simbol BTCUSDT
    const data = await res.json();

    if (data && data.price) {
      console.log(`BTC/USDT Price: ${data.price}`);  // Debug log harga
      await fetch("https://ntfy.sh/A", { method: "POST", body: data.price });
    } else {
      console.error("Failed to get price or unexpected response format", data);
    }
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
