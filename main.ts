import { serve } from "https://deno.land/std/http/server.ts";

serve(() => fetch("https://ntfy.sh/A", { method: "POST", body: "2" }));
