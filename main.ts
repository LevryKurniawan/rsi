Deno.cron("RSI", "* * * * *", async () => {
  const url = "https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=7"
  const res = await fetch(url)
  const d = await res.json()
  console.log(d) // Debug: lihat hasil response
})
