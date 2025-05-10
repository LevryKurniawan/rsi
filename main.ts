async function getRSI() {
  const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=100");
  const closes = (await res.json()).slice(0, -1).map(c => +c[4]);
  const period = 6;

  if (closes.length <= period) return;

  let [gains, losses] = [0, 0];
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }

  let [avgGain, avgLoss] = [gains / period, losses / period];
  for (let i = period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const [gain, loss] = [diff > 0 ? diff : 0, diff < 0 ? -diff : 0];
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  const rsi = 100 - (100 / (1 + avgGain / avgLoss));

  // Kirim notifikasi ke ntfy.sh
  await fetch("https://ntfy.sh/A", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "RSI 6 (1m): " + rsi.toFixed(2) })
  });
}

// Jalankan fungsi untuk pertama kali
getRSI();
