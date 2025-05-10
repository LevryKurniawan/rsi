// main.ts

import { RSI } from "https://deno.land/x/technicalindicators/mod.ts";

// Fungsi untuk mengambil harga terkini dari pasangan BTC/FDUSD pada Binance
async function fetchBinanceData() {
  const url = "https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=100";
  const response = await fetch(url);
  const data = await response.json();
  return data.map((item: any) => parseFloat(item[4])); // Harga penutupan (close price)
}

// Fungsi untuk mengirimkan notifikasi ke ntfy.sh
async function sendNotification(message: string) {
  const topic = "A"; // Gantilah dengan topik ntfy.sh Anda
  const url = `https://ntfy.sh/${topic}`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });
}

// Fungsi utama untuk menghitung RSI dan mengirimkan notifikasi
async function main() {
  try {
    const prices = await fetchBinanceData();
    
    // Menghitung RSI dengan periode 6
    const rsiValues = RSI.calculate({ period: 6, values: prices });

    // Mengambil RSI terakhir (untuk bar 1m terakhir)
    const lastRSI = rsiValues[rsiValues.length - 1];

    // Mengirimkan nilai RSI ke ntfy.sh
    await sendNotification(`RSI 6 (1m) BTC/FDUSD: ${lastRSI.toFixed(2)}`);

    console.log(`RSI Terkini: ${lastRSI.toFixed(2)}`);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

// Jalankan fungsi utama
main();
