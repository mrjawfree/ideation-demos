import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const RECIPES = [
  { id: "bbq-dry-rub", name: "Classic BBQ Dry Rub" },
  { id: "hot-sauce", name: "Classic Hot Sauce" },
  { id: "bbq-sauce", name: "BBQ Sauce" },
  { id: "marinade", name: "Soy-Ginger Marinade" },
];

function pickRecipe(): { id: string; name: string } {
  return RECIPES[Math.floor(Math.random() * RECIPES.length)];
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: Record<string, unknown>
): Promise<boolean> {
  // Web Push with VAPID — uses the web-push compatible fetch approach
  // In production, use the web-push npm package or Deno equivalent
  // For now, we use a direct fetch to the push endpoint with the payload
  try {
    const { default: webpush } = await import(
      "https://esm.sh/web-push@3.6.7"
    );

    webpush.setVapidDetails(
      "mailto:hello@spicescale.app",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (err) {
    console.error("Push send failed:", subscription.endpoint, err);
    return false;
  }
}

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (
    authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` &&
    authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "daily_reminder";

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const column =
    type === "weekly_meal_plan" ? "weekly_meal_plan" : "daily_reminder";
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth, user_id")
    .eq(column, true);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!subscriptions?.length) {
    return Response.json({ sent: 0, message: "No subscribers" });
  }

  const recipe = pickRecipe();
  const greeting = getTimeOfDayGreeting();

  const payload =
    type === "weekly_meal_plan"
      ? {
          title: "Your Weekly Meal Plan",
          body: `${greeting}! Plan your week with ${RECIPES.length} recipes ready to scale.`,
          url: "/meal-planner.html",
        }
      : {
          title: `${greeting}, Chef!`,
          body: `Haven't tried ${recipe.name} lately? Scale it up tonight.`,
          recipeId: recipe.id,
          url: `/?recipe=${recipe.id}`,
        };

  let sent = 0;
  const staleEndpoints: string[] = [];

  for (const sub of subscriptions) {
    const ok = await sendWebPush(sub, payload);
    if (ok) {
      sent++;
    } else {
      staleEndpoints.push(sub.endpoint);
    }
  }

  if (staleEndpoints.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  return Response.json({
    sent,
    failed: staleEndpoints.length,
    type,
    recipe: type === "daily_reminder" ? recipe.name : undefined,
  });
});
