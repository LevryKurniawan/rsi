Deno.cron("Send BTC price every minute", "*/1 * * * *", async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await res.json();

    if (data && data.bitcoin && data.bitcoin.usd) {
      console.log(`BTC/USDT Price: ${data.bitcoin.usd}`);
      await fetch("https://ntfy.sh/A", { method: "POST", body: `${data.bitcoin.usd}` });
    } else {
      console.error("Failed to get price or unexpected response format", data);
    }
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
