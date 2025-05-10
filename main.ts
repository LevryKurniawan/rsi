Deno.cron("RSI", "* * * * *", async () => {
  const url = "https://api.binance.com/api/v3/klines?symbol=BTCFDUSD&interval=1m&limit=7"
  const res = await fetch(url)
  const d = await res.json()
  const c = d.map(i => +i[4])
  const g = c.slice(1).map((v, i) => v - c[i])
  const u = g.map(x => x > 0 ? x : 0).reduce((a, b) => a + b) / 6
  const dn = g.map(x => x < 0 ? -x : 0).reduce((a, b) => a + b) / 6
  const rsi = 100 - 100 / (1 + u / dn)
  fetch("https://ntfy.sh/A", { method: "POST", body: rsi.toFixed(2) })
})
