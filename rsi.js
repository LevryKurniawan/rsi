async function fetchCandles() {
  const url = 'https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=7';
  const res = await fetch(url);
  const data = await res.json();
  return data.map(c => parseFloat(c[4])); // Ambil harga penutupan
}

function calculateRSI(closes, period = 6) {
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

async function sendNotification(rsi) {
  const message = `RSI 1m (6) BTC/FDUSD: ${rsi.toFixed(2)}`;
  await fetch("https://ntfy.sh/A", {
    method: "POST",
    body: message
  });
}

export default {
  async scheduled(event, env, ctx) {
    const closes = await fetchCandles();
    const rsi = calculateRSI(closes, 6);
    await sendNotification(rsi);
  }
}
