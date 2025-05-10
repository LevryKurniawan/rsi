// main.ts

// Fungsi untuk mengambil data candlestick BTC/FDUSD TF 1m dari Binance
async function fetchClosePrices(): Promise<number[]> {
  const url = "https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=100";
  const res = await fetch(url);
  const data = await res.json();
  return data.map((candle: any) => parseFloat(candle[4])); // Ambil harga penutupan
}

// Fungsi untuk menghitung RSI manual
function calculateRSI(values: number[], period: number): number {
  let gains = 0;
  let losses = 0;

  for (let i = values.length - period; i < values.length - 1; i++) {
    const diff = values[i + 1] - values[i];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Fungsi untuk kirim notifikasi ke ntfy.sh
async function sendNotification(message: string) {
  await fetch("https://ntfy.sh/A", {
    method: "POST",
    body: message,
  });
}

// Fungsi utama
Deno.serve(async () => {
  try {
    const prices = await fetchClosePrices();
    const rsi = calculateRSI(prices, 6);
    const message = `RSI 6 (1m) BTC/FDUSD: ${rsi.toFixed(2)}`;
    await sendNotification(message);
    return new Response(message);
  } catch (err) {
    console.error("Gagal:", err);
    return new Response("Terjadi kesalahan", { status: 500 });
  }
});
