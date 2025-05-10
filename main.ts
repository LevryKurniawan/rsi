Deno.cron("Run once a minute", "* * * * *", () => fetch("https://ntfy.sh/A", { method: "POST", body: "1" }));
