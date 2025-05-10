// file: rsi_wilder.ts

// Ambil data harga penutupan dari Binance
async function getPriceData(symbol: string, interval: string, limit: number): Promise<number[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.map((kline: any) => parseFloat(kline[4])); // close price
}

// Hitung RSI dengan metode Wilder
function calculateRSIWilder(prices: number[], period: number): number {
  if (prices.length <= period) throw new Error("Jumlah data kurang");

  let gains = 0;
  let losses = 0;

  // Inisialisasi: hitung average gain/loss pertama
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder smoothing
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Kirim notifikasi ke ntfy.sh
async function sendNotification(rsi: number) {
  const body = `RSI(6) BTC/FDUSD saat ini: ${rsi.toFixed(2)}`;
  await fetch("https://ntfy.sh/rsi", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
  });
  console.log("Notifikasi dikirim:", body);
}

// Proses utama
async function checkRSI() {
  try {
    const prices = await getPriceData("BTCFDUSD", "1m", 100);
    const rsi = calculateRSIWilder(prices, 6);
    console.log("RSI(6):", rsi.toFixed(2));

    if (rsi < 30 || rsi > 70) {
      await sendNotification(rsi);
    }
  } catch (err) {
    console.error("Gagal memeriksa RSI:", err.message);
  }
}

// Jalankan tiap 1 menit
checkRSI(); // jalankan langsung
setInterval(checkRSI, 60 * 1000); // ulangi setiap 1 menit
