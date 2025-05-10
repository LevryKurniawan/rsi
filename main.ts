Deno.cron("RSI", "*/1 * * * *", async () => {
  const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=7");
  const data = await res.json();
  
  const closes = data.map((d: any) => parseFloat(d[4])); // Ambil harga penutupan (index 4)
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      gains.push(change);
      losses.push(0);
    } else {
      losses.push(-change);
      gains.push(0);
    }
  }

  const avgGain = gains.reduce((a, b) => a + b, 0) / 6;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / 6;
  
  const RS = avgGain / avgLoss;
  const RSI = 100 - (100 / (1 + RS));
  
  fetch("https://ntfy.sh/A", { method: "POST", body: `RSI: ${RSI.toFixed(2)}` });
});
