import { cron } from "https://deno.land/x/deno_deploy_cron/mod.ts";

async function sendTime() {
  const now = new Date().toLocaleString();  // Ambil waktu sekarang

  // Kirim permintaan POST ke ntfy.sh/A
  const response = await fetch('https://ntfy.sh/A', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Waktu sekarang: ${now}`,
    }),
  });

  if (response.ok) {
    console.log("Waktu berhasil dikirim!");
  } else {
    console.error("Gagal mengirim waktu:", response.status);
  }
}

// Daftarkan cron job yang berjalan setiap menit
cron("* * * * *", sendTime);
