// rsi.ts

// Fetch harga terbaru dari Binance
async function getRSI() {
  const response = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=7");
  const data = await response.json();

  // Ambil harga penutupan (close price)
  const closes = data.map((candle: any) => parseFloat(candle[4]));
  const len = closes.length;

  let gain = 0;
  let loss = 0;

  // Hitung gain dan loss selama 6 periode terakhir
  for (let i = 0; i < 6; i++) {
    const diff = closes[i + 1] - closes[i];
    if (diff > 0) {
      gain += diff;
    } else {
      loss -= diff;
    }
  }

  // Hitung average gain dan average loss
  const avgGain = gain / 6;
  const avgLoss = loss / 6;

  let rsi = 100; // Default jika avgLoss == 0
  if (avgLoss !== 0) {
    const rs = avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
  }

  // Kirim notifikasi ke ntfy.sh
  const message = `RSI 6 (1m) BTC/FDUSD: ${rsi.toFixed(2)}`;
  console.log(message);

  // Kirim ke ntfy.sh
  await fetch("https://ntfy.sh/A", {
    method: "POST",
    body: message,
  });
}

// Jalankan fungsi setiap 1 menit
setInterval(getRSI, 60000);  // 60000 ms = 1 menit
