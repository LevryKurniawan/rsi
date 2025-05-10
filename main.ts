import { Cron } from "https://deno.land/x/deno_cron/cron.ts";

new Cron("*/1 * * * *", () => fetch("https://ntfy.sh/A", { method: "POST", body: "1" }));
